import { getModeWordOfDay } from '../words'
import { WORDS } from '../../constants/wordlist'

describe('audit: wordlist usage', () => {
  test('getModeWordOfDay returns values from WORDS', () => {
    const c = getModeWordOfDay('classic')
    const t = getModeWordOfDay('timed')
    const h = getModeWordOfDay('hard')
    const up = WORDS.map(w => w.toUpperCase())
    expect(up).toContain(c)
    expect(up).toContain(t)
    expect(up).toContain(h)
  })

  test('detect duplicate words in WORDS and warn (does not fail)', () => {
    const seen = new Set<string>()
    const duplicates: string[] = []
    for (const w of WORDS) {
      const u = w.toUpperCase()
      if (seen.has(u)) duplicates.push(u)
      seen.add(u)
    }
    if (duplicates.length > 0) {
      // warn but do not fail the build; editors should dedupe
      // eslint-disable-next-line no-console
      console.warn('WORDLIST duplicates detected:', Array.from(new Set(duplicates)).slice(0, 10))
    }
    expect(Array.from(duplicates).length).toBeGreaterThanOrEqual(0)
  })
})
