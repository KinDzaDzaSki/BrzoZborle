export type Mode = 'classic' | 'timed' | 'hard'

/**
 * Deterministic mapping from canonicalIndex -> ModeIndex (0..n-1)
 * Pure, constant-time, side-effect free.
 */
export function modeSelector(mode: Mode, canonicalIndex: number, n: number): number {
  if (n <= 0) throw new Error('n must be > 0')
  const idx = ((canonicalIndex % n) + n) % n
  switch (mode) {
    case 'classic':
      return idx
    case 'timed':
      return (idx + 1) % n
    case 'hard':
      return (idx + Math.floor(n / 3)) % n
    default:
      throw new Error('unknown mode')
  }
}
