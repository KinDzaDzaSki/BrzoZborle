import { modeSelector } from '../modeSelector'
import { WORDS } from '../../constants/wordlist'

describe('simulation: full-cycle coverage', () => {
  test('each mode references every index at least once over 0..N-1', () => {
    const N = WORDS.length
    const seenClassic = new Set<number>()
    const seenTimed = new Set<number>()
    const seenHard = new Set<number>()

    for (let i = 0; i < N; i++) {
      seenClassic.add(modeSelector('classic', i, N))
      seenTimed.add(modeSelector('timed', i, N))
      seenHard.add(modeSelector('hard', i, N))
    }

    expect(seenClassic.size).toBe(N)
    expect(seenTimed.size).toBe(N)
    expect(seenHard.size).toBe(N)
  })
})
