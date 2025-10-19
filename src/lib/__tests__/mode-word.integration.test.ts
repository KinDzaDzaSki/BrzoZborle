import { getModeWordOfDay } from '../words'
import { WORDS } from '../../constants/wordlist'

const EPOCH_START = 1640995200000
const MS_IN_DAY = 86400000

describe('integration: mode-word', () => {
  test('for fixed timestamp, mode words are in WORDS and pairwise distinct when N>=3', () => {
    const N = WORDS.length
    if (N < 3) {
      return
    }
    const offset = new Date().getTimezoneOffset() * 60000
    const i = 10
    const now = EPOCH_START + offset + i * MS_IN_DAY + 1000
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => now)
    try {
      const c = getModeWordOfDay('classic')
      const t = getModeWordOfDay('timed')
      const h = getModeWordOfDay('hard')
      expect(WORDS.map(w => w.toUpperCase())).toContain(c)
      expect(WORDS.map(w => w.toUpperCase())).toContain(t)
      expect(WORDS.map(w => w.toUpperCase())).toContain(h)
      expect(new Set([c, t, h]).size).toBe(3)
    } finally {
      spy.mockRestore()
    }
  })
})
