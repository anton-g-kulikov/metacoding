# Repository Organization

Use this reference to keep repository structure and documentation MECE. If the repo already has a different but coherent structure, preserve its conventions while keeping the same separation of concerns.

## Root Directory Standards

- Keep the root clean. Only essential top-level files should live there, such as `README.md`, `CHANGELOG.md`, `package.json`, `LICENSE`, and major config files.
- Do not place application source files directly in the root.
- Keep configuration files organized and documented.
- Ensure ignore files exclude build artifacts, dependencies, temporary outputs, and generated local-agent files.

## Directory Organization

Prefer a structure equivalent to:

```text
/src        # application and library source code
/test       # automated tests, fixtures, and test documentation
/_meta      # system, architecture, API, and project-management docs
```

Within source and tests:

- Group by feature or domain before grouping by file type.
- Keep reusable modules under stable locations such as `components`, `services`, `types`, `utils`, or equivalents.
- Keep test fixtures and helper data under the test tree, not in ad hoc temp folders.

## MECE Documentation Architecture

Each durable concept should have one primary home.

- `README.md`
  - project overview
  - setup
  - usage
  - user-facing workflows
- `/_meta/system-documentation.md`
  - evergreen system behavior
  - stable repository structure
  - non-temporal technical guidance
- `/_meta/api-design.md`
  - API contracts
  - integration patterns
  - interface decisions
- `/_meta/architecture-decisions.md`
  - architectural tradeoffs and rationale
- `/_meta/project-task-list.md`
  - active tasks
  - roadmap items
  - status tracking and temporal planning
- `/test/test-documentation.md`
  - documented test cases
  - test strategy
  - coverage intent and scenario tracking

Rules:

- Do not duplicate the same policy or status across multiple documents.
- Keep system documentation evergreen and free of task-status noise.
- Keep project-management documents temporal and status-oriented.
- Keep test intent in test documentation, not scattered through unrelated docs.
- Update exactly the artifact whose responsibility changed.

## Temporary File Management

- Remove temporary files, debug outputs, and experimental artifacts after they are no longer needed.
- Move useful temporary material to the correct permanent location:
  - test data to `/test/fixtures/`
  - documentation samples to the relevant doc
  - config examples to examples or documentation
- Do not leave orphaned files behind after implementation or verification.

## File Naming and Organization

- Keep tests within the test tree.
- Keep one main responsibility per file where practical.
- Prefer descriptive, stable names over generic scratch names.
- Avoid mixing unrelated concerns inside a single file or folder.

## Workflow Implications

- Repository organization is not optional polish. Validate it during repo grounding.
- If a requested change would create documentation overlap or structural drift, correct the organization as part of the task or record the follow-up explicitly.
- Mandatory TDD depends on this structure: test documentation belongs under `/test`, project status belongs under `/_meta`, and implementation belongs under source directories.
