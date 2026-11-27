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
/test       # automated tests and fixtures
/_meta      # system, architecture, and API docs, the glossary, and decision records
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
  - architectural trade-offs and rationale
- `/_meta/glossary.md`
  - the project's own terms and what they mean

Rules:

- Keep each policy or fact in one document.
- Keep system documentation evergreen and free of task-status noise.
- Update exactly the artifact whose responsibility changed.

## Task and Test Records

Task status and test intent live where the work happens: the confirmed scope summary, the issue or pull request, the tests themselves, and version control history.

- If the repo already keeps a task list or a test documentation file, keep updating it as part of the task.
- Create neither in a repo that lacks one.

## Decision Records

`/_meta/architecture-decisions.md` holds the decisions a future reader would otherwise question. Record a decision only when all three are true:

1. **Hard to reverse.** Changing course later would cost real work.
2. **Surprising without context.** Someone reading the code would wonder why it was done this way.
3. **A real trade-off.** There were workable alternatives, and this one was chosen for stated reasons.

A decision reaches this file through the scope summary: the interview marks it `[record]`, the user confirms the summary, and the entry is written once the work is done. Give each entry a date, the decision, the alternatives considered, and why this one won.

Create the file with the first such entry. If the repo already keeps decision records somewhere else, use that place.

## Glossary

`/_meta/glossary.md` holds the project's own terms, one line each: the term, what it means in this project, and the words to avoid for it.

```text
**Order**: a customer's confirmed purchase. Avoid: cart, basket.
```

- Read it while grounding, and use its terms in code, tests, docs, and questions to the user.
- Add or correct a term at the moment its meaning is settled.
- Keep it to meanings. Implementation detail belongs in the system documentation.
- If the repo already keeps a glossary somewhere else, use that one.
- If the repo has no glossary, propose the file to the user before creating it.

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
- Mandatory TDD depends on this structure: tests belong under the test tree and implementation under source directories.
