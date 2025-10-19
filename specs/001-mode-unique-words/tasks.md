# Tasks: Mode-specific unique words

**Feature**: Mode-specific unique words
**Feature dir**: specs/001-mode-unique-words
**Created**: 2025-10-19

## Phase 1 — Setup

- [ ] T001 Ensure feature directory exists: `specs/001-mode-unique-words` (no file change, validation)
- [ ] T002 [P] Create placeholder implementation plan at `specs/001-mode-unique-words/plan.md` (if missing) — add tech stack & high-level structure
- [ ] T003 Initialize `specs/001-mode-unique-words/tasks.md` (this file)

## Phase 2 — Foundational (blocking prerequisites)

- [ ] T004 Add ModeSelector signature and tests placeholder: `src/lib/modeSelector.ts` (create file with exported function signature and JSDoc)
- [ ] T005 Add unit test harness file: `test/modeSelector.test.ts` (create test file referencing `src/lib/modeSelector.ts`)
- [ ] T006 [P] Add spec reference and design notes to `specs/001-mode-unique-words/README.md` (summarize mappings and acceptance criteria)

## Phase 3 — [US1] Mode-specific daily word (Priority: P1)

- [ ] T007 [US1] Implement ModeSelector core logic in `src/lib/modeSelector.ts` using chosen transforms (Classic=identity; Timed=+1; Hard=+floor(N/3))
- [ ] T008 [US1] Add function `getModeWordOfDay(mode: 'classic'|'timed'|'hard')` in `src/lib/words.ts` that calls ModeSelector and returns `WORDS[ModeIndex].toUpperCase()`
- [ ] T009 [US1] Update `src/App.tsx` to use `getModeWordOfDay(gameMode)` where appropriate (replace `getWordOfDay()` usage for mode-specific screens)
- [ ] T010 [US1] Add unit tests in `test/modeSelector.test.ts` that validate for sample indices (0..min(100, N-1)) that returned words exist in `src/constants/wordlist.ts` and are deterministic
- [ ] T011 [US1] Add an integration test that simulates starting a game in each mode for a fixed timestamp and asserts solutions are pairwise distinct when `WORDS.length >= 3` (file: `test/integration/mode-word.integration.test.ts`)
 - [ ] T011a [US1] Add simulation/full-cycle coverage test: iterate indices `0..N-1`, collect ModeIndex per mode, and assert each mode references every index at least once (file: `test/simulation/full-cycle-coverage.test.ts`)

## Phase 4 — [US2] Deterministic and persistent mapping (Priority: P2)

- [ ] T012 [US2] Add tests asserting determinism across simulated environments: `test/determinism/determinism.test.ts` (call `getModeWordOfDay` with fixed Date.now override)
- [ ] T013 [US2] Ensure mode selection logic is side-effect free (code review task): update `src/lib/modeSelector.ts` to avoid any global state
- [ ] T014 [US2] Add logger-free, pure implementation to `src/lib/modeSelector.ts` and validate performance manually (document in `specs/001-mode-unique-words/README.md`)

## Phase 5 — [US3] Single master list (Priority: P3)

- [ ] T015 [US3] Audit `src/constants/wordlist.ts` and `src/constants/valid-guesses.ts` to confirm canonical `WORDS` is used; document any discrepancies in `specs/001-mode-unique-words/README.md`
- [ ] T016 [US3] Add test that asserts `getModeWordOfDay` only references `WORDS` and not separate lists (`test/audit/wordlist-audit.test.ts`)

## Final Phase — Polish & cross-cutting

- [ ] T017 Update `specs/001-mode-unique-words/checklists/requirements.md` with completed validation statuses and dates
- [ ] T018 Add changelog entry in `specs/001-mode-unique-words/CHANGELOG.md` summarizing implementation decisions and mapping
- [ ] T019 [P] Code review and merge readiness: ensure unit and integration tests pass locally
- [ ] T020 [P] Optional: performance profiling script `tools/profile-mode-selector.js` (document how to run)
- [ ] T021 [P] CI gating: update CI (e.g., GitHub Actions) to run the new integration tests and block merges to protected branches until they pass


## Dependencies

- Stories should be completed in priority order: US1 -> US2 -> US3
- Foundational tasks T004-T006 must complete before US1 tasks T007-T011

## Parallel execution examples

- T004 and T005 (test harness and ModeSelector signature) can be implemented in parallel
- T010 (unit tests) and T011 (integration test) can be written in parallel once T007 and T008 exist
- T015 and T016 (audit and test) can be run in parallel with US2 tasks

## Implementation strategy

- MVP: implement Phase 3 [US1] only (ModeSelector + getModeWordOfDay + App wiring + unit tests). This yields an independently testable feature that changes how the app picks words per mode while keeping the master list.
- Incrementally add US2 determinism tests and US3 audits.

## Task counts & summary

- Total tasks: 20
- Tasks per story:
  - Setup/Foundational: 6
  - US1: 5
  - US2: 3
  - US3: 2
  - Polish: 4
- Parallel opportunities: T004/T005, T010/T011, T015/T016

---

**Notes**: All tasks conform to the required checklist format (checkbox, TaskID, optional [P], optional [USx], and file path where relevant). If you want tests excluded/added or prefer a different ModeSelector transform, tell me and I'll regenerate `tasks.md`.