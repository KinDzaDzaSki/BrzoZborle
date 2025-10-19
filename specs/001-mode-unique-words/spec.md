# Feature Specification: Mode-specific unique words

**Feature Branch**: `001-mode-unique-words`
**Created**: 2025-10-19
**Status**: Draft
**Input**: User description: "i want the 3 different mods the game offers to offer unique words based on the initial game logic. the word list shoudn't be splitted, but each mode uses its unique method of selecting the word based on the original algorithm"

## Summary

Make each game mode (Classic, Timed, Hard) present a unique daily solution while keeping a single master `WORDS` array. Each mode's solution is derived deterministically from the canonical day index (the existing epoch-derived index). No separate word lists or persistent per-mode stores will be created.

## User Scenarios & Testing (mandatory)

### User Story 1 - Mode-specific daily word (Priority: P1)

As a player who selects a game mode (Classic, Timed, Hard), I want the game to present a unique daily solution for the chosen mode so that mode choice changes the play experience while all modes continue to use the same master word list.

Why this priority: This is the main user-visible change requested.

Independent Test: For a fixed calendar day (or timestamp), call the mode-specific selector for each mode and verify the three returned words are:
- present in `WORDS`;
- deterministic across reloads; and
- pairwise distinct when `WORDS.length >= 3`.

Acceptance Scenarios:
1. Given day D, when starting Classic, then solution = Classic-mode word for D (from `WORDS`).
2. Given day D, when starting Timed, then solution = Timed-mode word for D and differs from Classic's word for D.
3. Given day D, when starting Hard, then solution = Hard-mode word for D and differs from the other two for D.

### User Story 2 - Deterministic and persistent mapping (Priority: P2)

As a returning player I want the mode-specific daily word to be deterministic so reloading/sharing reproduces the same solution.

Independent Test: For a fixed timestamp, invoke the selector in multiple environments and assert identical results per mode.

### User Story 3 - Single master list (Priority: P3)

As a product owner I want a single `WORDS` list to be the source of truth so editorial maintenance remains centralized.

Independent Test: Ensure every mode's solution equals an element from `WORDS` and no per-mode lists are referenced.

## Edge Cases

- If `WORDS.length < 3`, selectors may return repeated words; implementations should prefer distinct choices when possible and tests must document behavior.
- If `WORDS` is edited (entries added/removed), mappings for subsequent days may change; behavior during a live editorial update should be documented and tested.
- Duplicate entries in `WORDS` are treated by position; editors should avoid duplicates. Tests should warn on duplicates.

## Requirements (mandatory)

### Functional Requirements

- FR-001: Use the existing master `WORDS` list as the sole source of candidate solutions for all modes.
- FR-002: For any calendar day D, deterministically map D to three (mode, word) pairs: Classic, Timed, Hard. Mapping must be repeatable across runs and environments.
- FR-003: For any day D, the three words MUST be elements of `WORDS` and pairwise distinct unless `WORDS.length < 3`.
- FR-004: Mode mapping MUST be a deterministic transform of the canonical day index (getWordOfDayIndex) — the original algorithm remains canonical.
- FR-005: Over `WORDS.length` canonical days, each mode's mapping should reference every index at least once (coverage/cycling requirement).
- FR-006: Do not create persistent per-mode word stores or split the master list into separate lists.
- FR-007: ModeSelector must be constant-time, side-effect free, and safe for render paths.
- FR-008: Provide tests that assert (a) returned word ∈ `WORDS`, (b) determinism for a fixed timestamp, (c) uniqueness when `WORDS.length >= 3`.

## Key Entities

- WordList (`WORDS`): ordered master array of candidate solutions (length N).
- CanonicalDayIndex: integer from existing epoch-based algorithm (getWordOfDayIndex).
- ModeSelector(mode, canonicalIndex, N) -> ModeIndex: deterministic mapping to an index in `WORDS`.
- ModeSolution: the string `WORDS[ModeIndex]` (uppercase for display).

## Success Criteria (mandatory)

- SC-001 Determinism: For fixed timestamp T, mode selector returns identical results across runs (100%).
- SC-002 Uniqueness: For ≥99% of days across a full `WORDS.length` sample, the three mode solutions are pairwise distinct (document exceptions if `WORDS.length < 3`).
- SC-003 Source integrity: 100% of mode solutions are from `WORDS`.
- SC-004 Coverage: Over any window of `WORDS.length` canonical days, each mode references every entry index at least once.
- SC-005 Performance: Mode selection is constant-time and suitable for render paths (informational profiling acceptable).

## Assumptions

- `getWordOfDayIndex()` is the canonical day index and remains stable.
- Editorial will avoid duplicate entries in `WORDS` where possible.
- This feature only changes how solutions are selected; it does not change persistence or other game mechanics.

## Implementation notes (for planners) — selected approach (Choice A)

The team chose the deterministic transform strategy Option A (simple offsets). These are implementation notes, not acceptance criteria, but they are approved as the default mapping to be used unless stakeholders request otherwise:

- Classic: ModeIndex = CanonicalDayIndex
- Timed: ModeIndex = (CanonicalDayIndex + 1) mod N
- Hard: ModeIndex = (CanonicalDayIndex + floor(N / 3)) mod N

Rationale: Simple, predictable offsets spread the three mode words across the list while remaining easy to test and reason about. They also satisfy cycling and constant-time requirements.

## Tests to add (recommendations)

- Unit test: For a selection of canonical indices (0..min(100,N-1)), assert ModeSolution(mode, index) ∈ `WORDS`, deterministic, and distinct for index when `N >= 3`.
- Simulation test: Run a full cycle of length `N` and assert coverage per mode and uniqueness statistics.

## Change log

- 2025-10-19: Draft created and Choice A selected for ModeSelector transforms.

## Time semantics & measurement clarifications

- Canonical day index timezone: `getWordOfDayIndex()` is defined to use UTC and treat calendar days as UTC-midnight to UTC-midnight intervals. Implementers must preserve this behavior to avoid cross-timezone drift.

- SC-002 (Uniqueness) measurement method: Run a deterministic simulation over the full cycle `i = 0..N-1` where `N = WORDS.length` using the canonical indices as inputs; for each canonical index compute the three ModeSolutions and count the fraction of indices where the three words are pairwise distinct. The pass threshold is >= 99% distinct over the full-cycle sample (document any exceptions for small `N`).

- SC-005 (Performance) guidance: Mode selection must be constant-time. For informational profiling, measure average latency of `modeSelector` over 1,000,000 sampled calls on CI or a representative developer machine (Node.js v18 on GitHub Actions runner) and report median & p95 latencies. No strict pass/fail target is required here, but implementations should be sub-millisecond per call on typical CI runners.

