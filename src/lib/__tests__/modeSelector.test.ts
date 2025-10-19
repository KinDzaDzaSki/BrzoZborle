import { modeSelector } from '../modeSelector'
import { getModeWordOfDay } from '../words'
import { WORDS } from '../../constants/wordlist'

describe('modeSelector', () => {
  test('classic returns canonical index', () => {
    const n = WORDS.length
    expect(modeSelector('classic', 5, n)).toBe(5 % n)
  })

  test('timed returns index+1 mod n', () => {
    const n = WORDS.length
    expect(modeSelector('timed', 5, n)).toBe((5 + 1) % n)
  })

  test('hard returns index+floor(n/3) mod n', () => {
    const n = WORDS.length
    expect(modeSelector('hard', 5, n)).toBe((5 + Math.floor(n / 3)) % n)
  })

  test('wraps negative canonicalIndex correctly', () => {
    const n = WORDS.length
    expect(modeSelector('classic', -1, n)).toBe(((-1 % n) + n) % n)
  })
})

describe('getModeWordOfDay (sanity)', () => {
  test('returns an uppercase string from WORDS', () => {
    const word = getModeWordOfDay('classic')
    expect(typeof word).toBe('string')
    expect(word).toBe(word.toUpperCase())
  })
})
