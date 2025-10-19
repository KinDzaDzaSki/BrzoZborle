# Data Model: Mode-specific unique words

**Feature**: Mode-specific unique words
**Created**: 2025-10-19

## Entities

- WordList (WORDS)
  - source: `src/constants/wordlist.ts`
  - type: ordered array of strings
  - invariants: elements are lowercase 5-letter words; duplicates discouraged

- CanonicalDayIndex
  - derived value (not persisted)
  - type: integer (0..N-1)
  - computed by `getWordOfDayIndex()` in `src/lib/words.ts`

- ModeSelector (logical entity)
  - inputs: mode (classic/timed/hard), canonicalIndex, N
  - output: ModeIndex (index into `WORDS`)

## Validation rules

- ModeIndex must be in range 0..N-1
- ModeSolution must be present in `WORDS` and be uppercase when returned to UI

*** End Data Model
