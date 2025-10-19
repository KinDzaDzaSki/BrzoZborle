# Implementation Plan: [FEATURE]

**Branch**: `001-mode-unique-words` | **Date**: 2025-10-19 | **Spec**: `spec.md`
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement mode-specific deterministic selection of daily words for the three game modes (Classic, Timed, Hard) while retaining a single master `WORDS` list. The plan introduces a small ModeSelector library (`src/lib/modeSelector.ts`) and a `getModeWordOfDay(mode)` accessor in `src/lib/words.ts`. The approach preserves existing epoch-based canonical index logic and applies deterministic transforms per mode (Choice A: identity, +1, +floor(N/3)).

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js v18+ runtime for build/test) and React (project already uses TypeScript + React)
**Primary Dependencies**: No new runtime libraries required. Dev/test: Jest + React Testing Library (existing project uses standard CRA testing stack), TypeScript.
**Storage**: None (words are constants in `src/constants/wordlist.ts`); no DB changes.
**Testing**: Jest for unit tests; existing test harness used for integration tests (update if needed).
**Target Platform**: Web (browser) — code runs in client environment; Node used for tests/build.
**Project Type**: Web single-page React application with a small library module under `src/lib/`.
**Performance Goals**: Mode selection must be constant-time and run within typical render budgets (sub-ms per call in developer machines).
**Constraints**: No changes to persistent storage; do not split master `WORDS` list; all changes must be test-first (constitution requirement).
**Scale/Scope**: Feature impacts client-side only; small code footprint (<100 LOC new), test coverage required.

## Constitution Check

The BrzoZborle constitution applies. Key gates for this plan:

- Library-First: Implement ModeSelector as a small, testable module under `src/lib/modeSelector.ts`. PASS (plan commits to a module).
- CLI Interface: Not applicable to UI-only changes, but the module SHOULD export a simple function usable from scripts. MARKED (SHOULD).
- Test-First: MUST create unit tests and integration tests before implementation. PASS (tests included in Phase 0/1 tasks).
- Integration Testing: Integration tests required for changed public behavior (getModeWordOfDay). PASS (tests included).
- Observability & Simplicity: Add minimal logging where appropriate; keep implementation simple. PASS (not introducing heavy infra).

No constitution violations detected.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Keep the existing single web project structure. Add a small module file:

- `src/lib/modeSelector.ts` — new module implementing ModeSelector
- `src/lib/words.ts` — existing file; add `getModeWordOfDay` export and tests update
- `test/` — add unit and integration tests under existing test hierarchy

This keeps the library small and adheres to the Library-First constitution principle.

## Complexity Tracking

No constitution violations requiring complexity justification were identified.


## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

