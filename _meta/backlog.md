# Backlog

Candidate tasks for the metacoding skills and CLI. Each one is shaped as its own task with `metacoding-shape` before it is built; the detail belongs in that task's scope summary or spec, not here. Remove an item when its task is shaped.

Most items come from a comparison of these skills with Matt Pocock's skills, made on 2026-11-27.

## Named as tasks

1. **Onboarding skill.** A separate skill from `init`, which only installs the skills and asks general project questions. It records once where the tracker, specs, glossary and decision records live, so later sessions read that instead of deciding again. Planned as the next task, on its own branch, through the full workflow. Where the answers are stored (the root `CLAUDE.md` was suggested) is decided when the task is shaped.
2. **Durable spec documentation with user stories.** Specs saved in their respective folders, holding the shaped solution and a set of user stories in Gherkin form with acceptance criteria, grouped by user role and tied to specific test cases and scenarios. Today's spec is a record of one task, filed by date, with success criteria and test intent as free prose and no link from a criterion to its test.

## Candidates

3. **Retro.** Nothing turns a session's mistakes into a rule, a check or a skill edit.
4. **Fallback standard for review.** When a repo documents no standards, the standards axis of `metacoding-review` has little to check against.
5. **Code-design guidance.** No skill covers module depth, interfaces or seams.
6. **Tickets and spec in `metacoding-shape`.** Tickets are a linear list: no blocking edges, no sizing rule, no expand-then-contract rule for a wide refactor. The spec has no step that agrees test seams with the user and no rule that keeps file paths and code out of it.
7. **Secrets in `metacoding-debug`.** No rule to redact secrets from the logs and output it captures.
8. **Mocking in `metacoding-tdd`.** One line of guidance, and no good and bad examples.
9. **Distribution.** There is no plugin manifest, and the workflow skill reads `references/project-context.md`, which only the CLI generates, so a plain skill install would break. `update` now also reads that file back; see the decision record of 2026-11-27.
10. **Prompt upkeep.**
    - The seven steps are described in both `metacoding-workflow/SKILL.md` and `references/workflow-rules.md`.
    - The five language references are a few generic lines each.
    - `metacoding-shape` does four jobs (interview, solution, tickets, spec), so it cannot run as a plain interview.
    - All five skills can be invoked by the model, and the workflow skill's description matches any feature work.
    - "Reject task switching" in Scope Control is a bare prohibition.
11. **Repo leftovers.** The tracked legacy `templates/` and `workflow/` folders, and the ignored `metacoding-*.tgz` files at the root.
