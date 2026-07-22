import type { ChampionImage } from '../champions'

export interface ItemStats {
  FlatHPPoolMod?: number
  rFlatHPModPerLevel?: number
  FlatMPPoolMod?: number
  rFlatMPModPerLevel?: number
  PercentHPPoolMod?: number
  PercentMPPoolMod?: number
  FlatHPRegenMod?: number
  rFlatHPRegenModPerLevel?: number
  PercentHPRegenMod?: number
  FlatMPRegenMod?: number
  rFlatMPRegenModPerLevel?: number
  PercentMPRegenMod?: number
  FlatArmorMod?: number
  rFlatArmorModPerLevel?: number
  PercentArmorMod?: number
  rFlatArmorPenetrationMod?: number
  rFlatArmorPenetrationModPerLevel?: number
  rPercentArmorPenetrationMod?: number
  rPercentArmorPenetrationModPerLevel?: number
  FlatPhysicalDamageMod?: number
  rFlatPhysicalDamageModPerLevel?: number
  PercentPhysicalDamageMod?: number
  FlatMagicDamageMod?: number
  rFlatMagicDamageModPerLevel?: number
  PercentMagicDamageMod?: number
  FlatMovementSpeedMod?: number
  rFlatMovementSpeedModPerLevel?: number
  PercentMovementSpeedMod?: number
  rPercentMovementSpeedModPerLevel?: number
  FlatAttackSpeedMod?: number
  PercentAttackSpeedMod?: number
  rPercentAttackSpeedModPerLevel?: number
  rFlatDodgeMod?: number
  rFlatDodgeModPerLevel?: number
  PercentDodgeMod?: number
  FlatCritChanceMod?: number
  rFlatCritChanceModPerLevel?: number
  PercentCritChanceMod?: number
  FlatCritDamageMod?: number
  rFlatCritDamageModPerLevel?: number
  PercentCritDamageMod?: number
  FlatBlockMod?: number
  PercentBlockMod?: number
  FlatSpellBlockMod?: number
  rFlatSpellBlockModPerLevel?: number
  PercentSpellBlockMod?: number
  FlatEXPBonus?: number
  PercentEXPBonus?: number
  rPercentCooldownMod?: number
  rPercentCooldownModPerLevel?: number
  rFlatTimeDeadMod?: number
  rFlatTimeDeadModPerLevel?: number
  rPercentTimeDeadMod?: number
  rPercentTimeDeadModPerLevel?: number
  rFlatGoldPer10Mod?: number
  rFlatMagicPenetrationMod?: number
  rFlatMagicPenetrationModPerLevel?: number
  rPercentMagicPenetrationMod?: number
  rPercentMagicPenetrationModPerLevel?: number
  FlatEnergyRegenMod?: number
  rFlatEnergyRegenModPerLevel?: number
  FlatEnergyPoolMod?: number
  rFlatEnergyModPerLevel?: number
  PercentLifeStealMod?: number
  PercentSpellVampMod?: number
}

export interface ItemGold {
  base: number
  total: number
  sell: number
  purchasable: boolean
}

export interface Item {
  id: string
  name: string
  description: string
  colloq: string
  image: ChampionImage
  gold: ItemGold
  tags: string[]
  stats: ItemStats
  maps: Record<string, boolean>
  inStore?: boolean
  requiredChampion?: string
  requiredAlly?: string
  from?: string[]
  into?: string[]
  iconPath?: string
}
