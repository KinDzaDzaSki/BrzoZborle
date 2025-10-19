# Developer notes: ModeSelector

This file contains implementation guidance and TypeScript signatures to help implementers and tests. It is not part of the public spec and may include implementation hints.

TypeScript examples:

```ts
export type Mode = 'classic' | 'timed' | 'hard';

/** Deterministic mapping from canonicalIndex -> ModeIndex (0..n-1) */
export function modeSelector(mode: Mode, canonicalIndex: number, n: number): number {
  switch (mode) {
    case 'classic':
      return canonicalIndex % n;
    case 'timed':
      return (canonicalIndex + 1) % n;
    case 'hard':
      return (canonicalIndex + Math.floor(n / 3)) % n;
    default:
      throw new Error('unknown mode');
  }
}

/**
 * Convenience accessor returning the uppercase solution for a given mode and optional date.
 */
export function getModeWordOfDay(mode: Mode, date?: Date): string {
  // Implementation note: obtain canonicalIndex = getWordOfDayIndex(date);
  // then return WORDS[modeSelector(mode, canonicalIndex, WORDS.length)].toUpperCase();
  throw new Error('example only');
}
```

Tests should import these types and verify determinism and coverage per the spec.
