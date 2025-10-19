# BrzoZborle Constitution

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-10-19

## Core Principles

### I. Library-First
All new features MUST begin as a self-contained library or module that is independently buildable,
testable, and documented. Code that is intended for reuse MUST be extracted into a named package/
module rather than duplicated. Rationale: ease of testing, reuse, and incremental delivery.

### II. CLI Interface
Each library or feature SHOULD expose a simple CLI entry point (stdin/args → stdout/stderr)
or equivalent programmatic API to enable automation, reproducible examples, and CI integration.
Rationale: simplifies integration testing and developer workflows.

### III. Test-First (NON-NEGOTIABLE)
Tests MUST be created before or alongside implementation:
- Unit tests for library-level behavior.
- Contract tests for public interfaces.
- Integration tests for cross-component flows.
TDD is the default development workflow: write failing tests → implement → make tests pass.

### IV. Integration Testing
Integration tests covering cross-component behavior and external contracts MUST exist for any
change that modifies public APIs, data formats, or runtime integrations. Integration tests MUST
be included in CI gates for merge to protected branches.

### V. Observability & Simplicity
- Instrumentation: Code that runs in production MUST emit structured logs and expose basic
  metrics where applicable.
- Simplicity: Prefer the simplest solution that satisfies requirements. Justify complexity in
  the plan document when introducing additional projects or frameworks.

## Governance

- Amendment procedure:
  - Propose changes via PR against `.specify/memory/constitution.md`.
  - Major changes (behavioral or backwards-incompatible) require review by core maintainers
    and a documented migration plan.
  - Minor clarifications (typo/wording) MAY be merged after one approving review.
- Versioning policy:
  - Follow semantic versioning for constitution: MAJOR for incompatible governance changes,
    MINOR for added principles/sections, PATCH for wording/typo fixes.
  - Every amendment MUST update the `Version`, `Last Amended`, and the Sync Impact Report.
- Compliance review:
  - Apply constitution checks in `.specify/templates/plan-template.md` and the plan workflow.
  - If a plan violates a constitution principle, the plan MUST either be revised or include a
    documented exception justification which is reviewed and approved in the PR.
- Record-keeping:
  - Dates MUST use ISO format (YYYY-MM-DD).
  - All approvals and rationale for major changes MUST be recorded in the associated PR.

## Notes
- This document defines non-negotiable project-level constraints intended to reduce
  rework and preserve long-term maintainability.
- If a ratification date is not known, fill `RATIFICATION_DATE` promptly and update the Sync
  Impact Report.
