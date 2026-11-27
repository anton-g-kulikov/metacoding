# Coding Standards

The rules for writing this repo's code, tests, skills, and docs that no automated check enforces.

## Skills and docs

- A skill owns its method: another skill file or a doc says when the skill is used and points to it, and does not repeat its rules. Before adding a rule about a document, a step, or where a file goes, search `skills/` and the docs for a rule on the same subject, and change it in the same commit. The same rule in two files drifts apart, and an agent that reads both gets two instructions.
