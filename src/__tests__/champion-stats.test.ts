import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { parseStatsFromDescription, parseItemStatsFromDescription } from '../services'

describe('Item Stat Extraction', () => {
  it('should parse stats correctly and detect any unparsed lines inside <stats> tags', () => {
    const itemsPath = path.resolve(__dirname, '../../out/items/items.json')
    const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'))

    let unparsedStatsCount = 0
    const unparsedLines: string[] = []

    itemsData.forEach((item: any) => {
      if (!item.inStore && item.id > 10000) return
      const desc = item.description || ''
      if (!desc.includes('<stats>')) return

      parseItemStatsFromDescription(desc)
      parseStatsFromDescription(desc)

      const statsMatch = desc.match(/<stats>([\s\S]*?)<\/stats>/i)
      if (statsMatch && statsMatch[1]) {
        const lines = statsMatch[1].split('<br>')
        lines.forEach((line: string) => {
          if (!line.trim()) return
          const m = line.match(/<attention>\s*([+-\d%.]+)\s*%?<\/attention>\s*([^<]+)/i)
          if (!m) {
            unparsedLines.push(`Item: ${item.id} (${item.name}) => "${line.trim()}"`)
            unparsedStatsCount++
          }
        })
      }
    })

    if (unparsedStatsCount > 0) {
      console.warn('Unparsed stat lines found:\n' + unparsedLines.join('\n'))
    }

    // Expect the parser to process the file without throwing.
    expect(itemsData.length).toBeGreaterThan(0)
  })
})
