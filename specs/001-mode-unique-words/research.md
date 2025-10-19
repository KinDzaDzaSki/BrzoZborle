# Research: Mode-specific unique words

**Feature**: Mode-specific unique words
**Created**: 2025-10-19

## Unknowns and resolution

- NEEDS CLARIFICATION: deterministic transform strategy — RESOLVED: Choice A selected (Classic=identity; Timed=+1; Hard=+floor(N/3)). Rationale: simple, easy to test, distributes words.
- Verify that `WORDS` is available as a runtime constant: CONFIRMED (see `src/constants/wordlist.ts`).
- Testing stack: use existing Jest/React Testing Library harness (project already has CRA + Jest setup).

## Decisions

- Implement a small `ModeSelector` module in `src/lib/modeSelector.ts`.
- Expose `getModeWordOfDay(mode)` from `src/lib/words.ts` which returns uppercase solution.
- Add unit tests and integration tests per constitution requirement.

## Alternatives considered

- Use hashing/permutation for mode mapping (Option C) — rejected: unnecessary complexity and slightly harder to reason/test.
- Create separate word lists per mode — rejected: violates requirement to keep single master list and increases editorial burden.

*** End Research
