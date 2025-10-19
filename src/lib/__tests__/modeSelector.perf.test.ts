import { modeSelector } from '../modeSelector'
import { WORDS } from '../../constants/wordlist'

describe('perf: modeSelector', () => {
  test('sample latency (informational)', () => {
    const N = WORDS.length
    const iterations = 10000
    const start = Date.now()
    for (let i = 0; i < iterations; i++) {
      modeSelector('classic', i % N, N)
      modeSelector('timed', i % N, N)
      modeSelector('hard', i % N, N)
    }
    const elapsed = Date.now() - start
    const perCallMs = elapsed / (iterations * 3)
    // Log informational metrics
    // eslint-disable-next-line no-console
    console.log(`modeSelector average ms/call: ${perCallMs}`)
    // No strict assertion; just ensure we didn't blow up
    expect(perCallMs).toBeGreaterThanOrEqual(0)
  })
})
