<#
.SYNOPSIS
    Downloads League of Legends champion, item, rune, and summoner spell data/assets from Community Dragon.
.DESCRIPTION
    Ensures snip-snip executable is available (downloading from GitHub releases if needed),
    fetches active champion, item, rune, and spell data from Community Dragon,
    and downloads their assets/icons in parallel.
.PARAMETER OutputDir
    The output directory where data will be saved. Default is '../public/cdragon'.
.PARAMETER MaxJobs
    Maximum number of champions to download in parallel. Default is 5.
.PARAMETER Champion
    Optional. If specified, only downloads this specific champion (e.g., 'annie').
.EXAMPLE
    .\download-cdragon.ps1
.EXAMPLE
    .\download-cdragon.ps1 -Champion "ahri"
#>
param (
    [string]$OutputDir = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "../public/cdragon"),
    [int]$MaxJobs = 5,
    [string]$Champion = $null
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $ScriptDir ".bin"
if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
}


$SnipSnipExe = Join-Path $BinDir "snip-snip.exe"
if (-not (Test-Path $SnipSnipExe)) {
    Write-Host "snip-snip not found in $BinDir. Downloading latest release from GitHub..." -ForegroundColor Cyan
    $releaseUrl = "https://github.com/BlossomiShymae/snip-snip/releases/download/4.0.2/snip-snip-win-x64.zip"
    $zipDest = Join-Path $BinDir "snip-snip.zip"
    
    Invoke-WebRequest -Uri $releaseUrl -OutFile $zipDest
    Expand-Archive -Path $zipDest -DestinationPath $BinDir -Force
    Remove-Item $zipDest -Force
    
    if (-not (Test-Path $SnipSnipExe)) {
        throw "Failed to extract snip-snip.exe into $BinDir"
    }
    Write-Host "snip-snip successfully downloaded and extracted." -ForegroundColor Green
}

# Resolve full path of snip-snip and OutputDir
$SnipSnipFullPath = (Resolve-Path $SnipSnipExe).Path
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}
$OutputDirFullPath = (Resolve-Path $OutputDir).Path

# ==============================================================================
# 1. FETCH PLAYABLE CHAMPIONS
# ==============================================================================
Write-Host "Fetching champion summary from Community Dragon..." -ForegroundColor Cyan
$champsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json"
try {
    $champs = Invoke-RestMethod -Uri $champsUrl
} catch {
    Write-Error "Failed to fetch champion list: $_"
}

# Filter out placeholder/invalid IDs and get champion objects with id and alias
$playableChampions = $champs | Where-Object { $_.id -gt 0 } | ForEach-Object {
    [PSCustomObject]@{
        id = $_.id
        alias = $_.alias.ToLower()
    }
} | Sort-Object -Property alias -Unique

if (-not [string]::IsNullOrWhiteSpace($Champion)) {
    $targetChamp = $Champion.ToLower().Trim()
    $matched = $playableChampions | Where-Object { $_.alias -eq $targetChamp }
    if ($matched) {
        $playableChampions = @($matched)
        Write-Host "Filtering to single champion: $targetChamp" -ForegroundColor Yellow
    } else {
        Write-Error "Champion '$Champion' not found in playable champions roster."
    }
}

Write-Host "Found $($playableChampions.Count) playable champions in roster." -ForegroundColor Green

# ==============================================================================
# 2. DOWNLOAD CHAMPIONS IN PARALLEL
# ==============================================================================
Write-Host "Starting parallel downloads using snip-snip (Max $MaxJobs parallel champions)..." -ForegroundColor Cyan

$playableChampions | ForEach-Object -ThrottleLimit $MaxJobs -Parallel {
    $champ = $_.alias
    $champId = $_.id
    $outputDir = $using:OutputDirFullPath
    $snipExe = $using:SnipSnipFullPath
    
    # 2.1 Download Game Data (.bin, stats, etc. - root files only)
    $dataUrl = "https://raw.communitydragon.org/latest/game/data/characters/$champ/"
    $dataOut = Join-Path $outputDir "champions/$champ/data"
    
    Write-Host "[$champ] Downloading game data..." -ForegroundColor Yellow
    $process1 = Start-Process -FilePath $snipExe -ArgumentList @($dataUrl, "-o", $dataOut, "-s", "--max-depth", "1") -NoNewWindow -PassThru -Wait
    
    # 2.2 Download Base Skin Splash Images
    $assetsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/$champ/skins/base/images/"
    $assetsOut = Join-Path $outputDir "champions/$champ/assets"
    
    Write-Host "[$champ] Downloading base skin images..." -ForegroundColor Yellow
    $process2 = Start-Process -FilePath $snipExe -ArgumentList @($assetsUrl, "-o", $assetsOut, "-s") -NoNewWindow -PassThru -Wait
    
    # Filter: Remove non-centered splash images (uncentered, tile, etc.)
    if (Test-Path $assetsOut) {
        Get-ChildItem -Path $assetsOut -File | Where-Object { $_.Name -notlike "*_centered_*" } | Remove-Item -Force
    }
    
    # 2.3 Download 128x128 Champ Select Icon
    $iconUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/$champId.png"
    $iconOut = Join-Path $assetsOut "icon.png"
    try {
        Invoke-WebRequest -Uri $iconUrl -OutFile $iconOut
    } catch {
        Write-Host "[$champ] Warning: Failed to download 128x128 icon" -ForegroundColor Red
    }
    
    # 2.4 Download HUD Spell Icons (Passive + QWER)
    $spellsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/$champ/hud/icons2d/"
    $spellsOut = Join-Path $assetsOut "hud"
    
    Write-Host "[$champ] Downloading spell icons..." -ForegroundColor Yellow
    $process3 = Start-Process -FilePath $snipExe -ArgumentList @($spellsUrl, "-o", $spellsOut, "-s") -NoNewWindow -PassThru -Wait
    
    if ($process1.ExitCode -eq 0 -and $process2.ExitCode -eq 0 -and $process3.ExitCode -eq 0) {
        Write-Host "[$champ] Completed successfully." -ForegroundColor Green
    } else {
        Write-Host "[$champ] Finished with errors (Data: $($process1.ExitCode), Assets: $($process2.ExitCode), Spells: $($process3.ExitCode))." -ForegroundColor Red
    }
}

# ==============================================================================
# 3. DOWNLOAD GLOBAL ITEMS DATA & ICONS (COMMUNITY DRAGON ONLY)
# ==============================================================================
Write-Host "Downloading global items data and icons..." -ForegroundColor Cyan

$itemsDir = Join-Path $OutputDirFullPath "items"
if (-not (Test-Path $itemsDir)) {
    New-Item -ItemType Directory -Path $itemsDir -Force | Out-Null
}

$itemsJsonUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json"
$itemsJsonOut = Join-Path $itemsDir "items.json"

Write-Host "Downloading items.json from Community Dragon..." -ForegroundColor Yellow
$validIconNames = @()

try {
    $cdragonItems = Invoke-RestMethod -Uri $itemsJsonUrl
    $cdragonItems | ConvertTo-Json -Depth 10 | Out-File $itemsJsonOut -Encoding utf8
    Write-Host "Saved items.json ($($cdragonItems.Count) total items)." -ForegroundColor Green

    # Map all valid icon filenames defined in Community Dragon items registry
    foreach ($item in $cdragonItems) {
        if ($item.iconPath) {
            $fileName = [System.IO.Path]::GetFileName($item.iconPath).ToLower()
            if (-not [string]::IsNullOrWhiteSpace($fileName)) {
                $validIconNames += $fileName
            }
        }
    }
} catch {
    Write-Host "Failed to process items.json: $_" -ForegroundColor Red
}

# Download item icons (icons2d - root files only)
$itemIconsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/"
$itemIconsOut = Join-Path $itemsDir "icons"
Write-Host "Downloading item icons..." -ForegroundColor Yellow
$processItems = Start-Process -FilePath $SnipSnipFullPath -ArgumentList @($itemIconsUrl, "-o", $itemIconsOut, "-s", "--max-depth", "1") -NoNewWindow -PassThru -Wait

# Filter downloaded item icons
if ($processItems.ExitCode -eq 0) {
    if ($validIconNames.Count -gt 0) {
        Write-Host "Filtering item icons using items.json registry..." -ForegroundColor Yellow
        $allIconFiles = Get-ChildItem -Path $itemIconsOut -Filter "*.png"
        $deletedCount = 0
        foreach ($file in $allIconFiles) {
            if ($validIconNames -notcontains $file.Name.ToLower()) {
                Remove-Item $file.FullName -Force
                $deletedCount++
            }
        }
        Write-Host "Item icons filtering completed. Removed $deletedCount unused icons." -ForegroundColor Green
    } else {
        Write-Host "Item icons downloaded without filtering." -ForegroundColor Green
    }
} else {
    Write-Host "Item icons download failed with exit code $($processItems.ExitCode)." -ForegroundColor Red
}

# ==============================================================================
# 4. DOWNLOAD GLOBAL RUNES DATA & ICONS (COMMUNITY DRAGON ONLY)
# ==============================================================================
Write-Host "Downloading global runes data and icons..." -ForegroundColor Cyan

$runesDir = Join-Path $OutputDirFullPath "runes"
if (-not (Test-Path $runesDir)) {
    New-Item -ItemType Directory -Path $runesDir -Force | Out-Null
}

$perksJsonUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json"
$perkstylesJsonUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json"
$perksJsonOut = Join-Path $runesDir "perks.json"
$perkstylesJsonOut = Join-Path $runesDir "perkstyles.json"

$validRuneIconPaths = @()

Write-Host "Downloading perks.json and perkstyles.json..." -ForegroundColor Yellow
try {
    $cdragonPerks = Invoke-RestMethod -Uri $perksJsonUrl
    $cdragonPerks | ConvertTo-Json -Depth 10 | Out-File $perksJsonOut -Encoding utf8
    Write-Host "Saved perks.json ($($cdragonPerks.Count) perks/runes)." -ForegroundColor Green

    # Map rune icon paths
    foreach ($perk in $cdragonPerks) {
        if ($perk.iconPath) {
            $relPath = $perk.iconPath -replace '^/lol-game-data/assets/v1/perk-images/', ''
            if ($relPath) {
                $validRuneIconPaths += $relPath.Replace('/', '\').ToLower()
            }
        }
    }
} catch {
    Write-Host "Failed to process perks.json: $_" -ForegroundColor Red
}

try {
    $cdragonStyles = Invoke-RestMethod -Uri $perkstylesJsonUrl
    $cdragonStyles | ConvertTo-Json -Depth 10 | Out-File $perkstylesJsonOut -Encoding utf8
    Write-Host "Saved perkstyles.json." -ForegroundColor Green

    # Map rune style tree icon paths (Precision, Domination, etc.)
    foreach ($style in $cdragonStyles.styles) {
        if ($style.iconPath) {
            $styleRelPath = $style.iconPath -replace '^/lol-game-data/assets/v1/perk-images/', ''
            if ($styleRelPath) {
                $validRuneIconPaths += $styleRelPath.Replace('/', '\').ToLower()
            }
        }
    }
} catch {
    Write-Host "Failed to process perkstyles.json: $_" -ForegroundColor Red
}

# Download rune icons (perk-images)
$runeIconsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/"
$runeIconsOut = Join-Path $runesDir "images"
Write-Host "Downloading rune icons..." -ForegroundColor Yellow
$processRunes = Start-Process -FilePath $SnipSnipFullPath -ArgumentList @($runeIconsUrl, "-o", $runeIconsOut, "-s") -NoNewWindow -PassThru -Wait

# Filter downloaded rune icons
if ($processRunes.ExitCode -eq 0) {
    if ($validRuneIconPaths.Count -gt 0) {
        Write-Host "Filtering rune icons using Community Dragon registry..." -ForegroundColor Yellow
        $allRuneFiles = Get-ChildItem -Path $runeIconsOut -Recurse -File
        $deletedRunesCount = 0
        foreach ($file in $allRuneFiles) {
            $fileRelPath = $file.FullName.Replace($runeIconsOut, "").TrimStart("\").ToLower()
            if ($validRuneIconPaths -notcontains $fileRelPath) {
                Remove-Item $file.FullName -Force
                $deletedRunesCount++
            }
        }
        
        # Remove remaining empty directories
        Get-ChildItem -Path $runeIconsOut -Recurse -Directory | 
            Sort-Object -Property FullName -Descending | 
            Where-Object { (Get-ChildItem -Path $_.FullName -Recurse -File).Count -eq 0 } | 
            ForEach-Object { Remove-Item $_.FullName -Force }
            
        Write-Host "Rune icons filtering completed. Removed $deletedRunesCount unused icons." -ForegroundColor Green
    } else {
        Write-Host "Rune icons downloaded without filtering." -ForegroundColor Green
    }
} else {
    Write-Host "Rune icons download failed with exit code $($processRunes.ExitCode)." -ForegroundColor Red
}

# ==============================================================================
# 5. DOWNLOAD SUMMONER SPELLS DATA & ICONS
# ==============================================================================
Write-Host "Downloading summoner spells data and icons..." -ForegroundColor Cyan

$spellsDir = Join-Path $OutputDirFullPath "spells"
if (-not (Test-Path $spellsDir)) {
    New-Item -ItemType Directory -Path $spellsDir -Force | Out-Null
}

$spellsJsonUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json"
$spellsJsonOut = Join-Path $spellsDir "summoner-spells.json"

Write-Host "Downloading and filtering summoner-spells.json..." -ForegroundColor Yellow
$playableSpellIconPaths = @()
try {
    $cdragonSpells = Invoke-RestMethod -Uri $spellsJsonUrl
    # Filter to only keep spells active in Summoner's Rift (gameModes contains "CLASSIC" and name is not empty)
    $filteredSpells = $cdragonSpells | Where-Object { $_.gameModes -contains "CLASSIC" -and -not [string]::IsNullOrWhiteSpace($_.name) }
    $filteredSpells | ConvertTo-Json -Depth 10 | Out-File $spellsJsonOut -Encoding utf8
    Write-Host "Filtered summoner-spells.json saved ($($filteredSpells.Count) spells)." -ForegroundColor Green
    
    foreach ($spell in $filteredSpells) {
        if ($spell.iconPath) {
            $relPath = $spell.iconPath -replace '^/lol-game-data/assets/DATA/Spells/Icons2D/', ''
            if ($relPath) {
                $playableSpellIconPaths += $relPath.ToLower()
            }
        }
    }
} catch {
    Write-Host "Failed to process summoner-spells.json: $_" -ForegroundColor Red
}

# Download summoner spell icons (spells/icons2d - root files only)
$spellIconsUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/"
$spellIconsOut = Join-Path $spellsDir "icons"
Write-Host "Downloading summoner spell icons..." -ForegroundColor Yellow
$processSpells = Start-Process -FilePath $SnipSnipFullPath -ArgumentList @($spellIconsUrl, "-o", $spellIconsOut, "-s", "--max-depth", "1") -NoNewWindow -PassThru -Wait

# Filter summoner spell icons
if ($processSpells.ExitCode -eq 0) {
    if ($playableSpellIconPaths.Count -gt 0) {
        Write-Host "Filtering summoner spell icons to CLASSIC mode only..." -ForegroundColor Yellow
        $allSpellIconFiles = Get-ChildItem -Path $spellIconsOut -Filter "*.png"
        $deletedSpellsCount = 0
        foreach ($file in $allSpellIconFiles) {
            $fileNameLower = $file.Name.ToLower()
            if ($playableSpellIconPaths -notcontains $fileNameLower) {
                Remove-Item $file.FullName -Force
                $deletedSpellsCount++
            }
        }
        Write-Host "Summoner spell icons filtering completed. Removed $deletedSpellsCount unused icons." -ForegroundColor Green
    } else {
        Write-Host "Summoner spell icons downloaded without filtering." -ForegroundColor Green
    }
} else {
    Write-Host "Summoner spell icons download failed with exit code $($processSpells.ExitCode)." -ForegroundColor Red
}

# 6. Download neutral monsters game data (Dragons, Baron, Red/Blue Buffs)
Write-Host "Downloading neutral monsters game data (Dragons, Baron, Red/Blue Buffs)..." -ForegroundColor Cyan

$monstersDir = Join-Path $OutputDirFullPath "monsters"
if (-not (Test-Path $monstersDir)) {
    New-Item -ItemType Directory -Path $monstersDir -Force | Out-Null
}

$neutralMonsters = @(
    "sru_dragon",
    "sru_dragon_fire",
    "sru_dragon_earth",
    "sru_dragon_water",
    "sru_dragon_air",
    "sru_dragon_hextech",
    "sru_dragon_chemtech",
    "sru_dragon_elder",
    "sru_baron",
    "sru_red",
    "sru_blue"
)

foreach ($monster in $neutralMonsters) {
    $monsterDataUrl = "https://raw.communitydragon.org/latest/game/data/characters/$monster/"
    $monsterDataOut = Join-Path $monstersDir "$monster/data"
    
    Write-Host "[$monster] Downloading monster game data..." -ForegroundColor Yellow
    $processMonster = Start-Process -FilePath $SnipSnipFullPath -ArgumentList @($monsterDataUrl, "-o", $monsterDataOut, "-s", "--max-depth", "1") -NoNewWindow -PassThru -Wait
    
    if ($processMonster.ExitCode -eq 0) {
        Write-Host "[$monster] Completed successfully." -ForegroundColor Green
    } else {
        Write-Host "[$monster] Failed with exit code $($processMonster.ExitCode)." -ForegroundColor Red
    }
}

Write-Host "All downloads completed successfully!" -ForegroundColor Green
