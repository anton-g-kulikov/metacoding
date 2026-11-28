# Backlog

Candidate tasks for the metacoding skills and CLI, in the order agreed on 2026-11-27. Each one is shaped as its own task with `metacoding-shape` before it is built; the detail belongs in that task's scope summary or spec, not here. Remove an item when its task is shaped.

Most items come from a comparison of these skills with Matt Pocock's skills, made on 2026-11-27.

## Next, each on its own branch

1. **Durable specs with user stories.** Specs saved in their respective folders, holding the shaped solution and a set of user stories in Gherkin form with acceptance criteria, grouped by user role and tied to specific test cases and scenarios. Today's spec is a record of one task, filed by date, with success criteria and test intent as free prose and no link from a criterion to its test. Shaped together with two other changes to what `metacoding-shape` writes:
   - Tickets are a linear list: no blocking edges, no sizing rule, no expand-then-contract rule for a wide refactor. The spec has no step that agrees test seams with the user and no rule that keeps file paths and code out of it.
   - `metacoding-shape` does four jobs (interview, solution, tickets, spec), so it cannot run as a plain interview.

## Later

- **Codebase scan.** `metacoding-design` assesses a module or area the user names. Nothing scans a whole codebase for candidates, such as by picking the files that change most from the git history, and reports them ranked.
- **Codex skills folder.** The CLI installs the Codex variant into `.codex/skills/`. Codex's docs, as read on 2026-11-27, name only `.agents/skills/` for a repo; the old folder still loads but is undocumented.
