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
/_meta      # system, architecture, and API docs, the glossary, decision records, coding standards, and specs
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
- `/_meta/coding-standards.md`
  - the repo's rules for writing code, tests, and docs that no automated check enforces
- `/_meta/specs/`
  - one file per task that needs a spec: its confirmed scope summary and its tickets

Rules:

- Keep each policy or fact in one document.
- Keep system documentation evergreen and free of task-status noise.
- Update exactly the artifact whose responsibility changed.

## Project Map

`.metacoding/project.md` is the project map: the file that says where this repo keeps its tracker, its specs, its glossary, and its decision records. The `metacoding-onboard` skill writes it and holds its format.

- Read it while grounding, when the repo has one.
- Where the project map names a place, use that place, and create it there when it does not exist yet.
- The tracker line says where this repo tracks work. A line that says none is an answer too: the repo tracks work nowhere, and the tickets are a checklist in the spec.
- The places this reference names for those four records, and its rules for a repo's own place, apply only to a place the project map has no line for, and to a repo with no project map.

## Specs, Tickets, and Test Records

The `metacoding-spec` skill decides which tasks need a spec, writes it once the user confirms the scope summary, and holds the rules and the file format. This reference covers only where things go:

- A spec goes where the repo already keeps specs. When it has no such place, it goes to `/_meta/specs/<date>-<slug>.md`.
- The tickets go to the repo's tracker when it keeps one current, such as issues or a task list. Where it has no tracker, the tickets are a checklist in the spec.
- Test intent lives in the scope summary, the spec, and the tests themselves. If the repo already keeps a test documentation file, keep updating it; do not create one.

## Decision Records

`/_meta/architecture-decisions.md` holds the decisions a future reader would otherwise question. Record a decision only when all three are true:

1. **Hard to reverse.** Changing course later would cost real work.
2. **Surprising without context.** Someone reading the code would wonder why it was done this way.
3. **A real trade-off.** There were workable alternatives, and this one was chosen for stated reasons.

A decision reaches this file through the scope summary: the `metacoding-spec` skill marks it `[record]` and writes the entry once the user confirms the summary, before the build starts. The skill holds the entry format and how to amend an entry.

A retro can add an entry too: the `metacoding-retro` skill proposes it in a lesson and writes it once the user approves.

Create the file with the first such entry. If the repo already keeps decision records somewhere else, use that place.

## Glossary

`/_meta/glossary.md` holds the project's own terms, one line each: the term, what it means in this project, and the words to avoid for it.

```text
**Order**: a customer's confirmed purchase. Avoid: cart, basket.
```

- Read it while grounding, and use its terms in code, tests, docs, and questions to the user.
- Add or correct a term once the scope summary that lists it is confirmed, or once the user approves a lesson from a retro that proposes it.
- Keep it to meanings. Implementation detail belongs in the system documentation.
- If the repo already keeps a glossary somewhere else, use that one.
- If the repo has no glossary, follow `references/platform-adaptation.md`.

## Coding Standards

`/_meta/coding-standards.md` holds the repo's rules for writing code, tests, and docs that no automated check enforces.

- A rule reaches this file through a retro: the `metacoding-retro` skill proposes it in a lesson and writes it once the user approves. The skill holds the method, and prefers an automated check to a rule.
- If the repo already keeps its standards somewhere else, use that place.
- If the repo has no such file, follow `references/platform-adaptation.md`.

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
