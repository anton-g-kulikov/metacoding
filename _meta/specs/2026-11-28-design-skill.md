# Spec: Design skill

- Status: in progress

## Goal

Give the metacoding skills code-design guidance, so an agent that designs or changes code thinks about module depth, interfaces and seams.

## Success criteria

- `metacoding init` and `metacoding update` install a sixth skill, `metacoding-design`, for all three agents.
- The skill defines four terms and states seven rules, with a good and a bad example for three of them.
- Run alone, it designs a new module or assesses an existing one, and changes no file.
- The workflow skill says when to use it, in the shape step and the build step.
- The review looks for two new design smells and reports them as follow-ups.

## In scope

- `skills/metacoding-design/` (new: `SKILL.md`, `agents/openai.yaml`).
- `skills/metacoding-workflow/SKILL.md` and `skills/metacoding-workflow/references/workflow-rules.md`.
- `skills/metacoding-review/SKILL.md`.
- `src/services/skill-manager.ts`, with `lib/` rebuilt.
- `test/unit/skill-content.test.ts`, `test/unit/skill-manager.test.ts`, `test/unit/update-command.test.ts`.
- README, CHANGELOG, `_meta/api-design.md`, `_meta/system-documentation.md`.
- This task's records: this spec, and `_meta/backlog.md`.
- Added on 2026-11-28, in ticket 1: a "Code Design" section in the README, next to the sections the other companion skills have, and the line of `_meta/backlog.md` that counted the skills.

## Out of scope

- A scan of a whole codebase for candidates. It is in the backlog under "Later".
- The five language references of the workflow skill, which the prompt-upkeep task owns.
- `metacoding-shape` and `metacoding-tdd`.
- Agreeing test seams with the user in the spec, which the durable-specs task owns.
- A version bump, pushing, a pull request.

## Solution

The skill's four terms, each with words to avoid:

- **Module**: anything with an interface and code behind it, such as a function, a class, a package or a service. Avoid: component, unit.
- **Interface**: everything a caller must know to use a module: names and types, the order of calls, errors, config. Avoid: API, signature.
- **Depth**: how much behavior sits behind the interface, compared with how much a caller must know. A module is deep or shallow. Avoid: size.
- **Seam**: the place where a module's interface sits. Callers and tests meet the module there, and what is behind it can be swapped without editing them. Avoid: boundary, layer.

The seven rules:

1. Prefer a deep module: a lot of behavior behind a small interface. One that only passes calls on is shallow.
2. The interface is everything a caller must know, including call order, errors and config, so keep all of that small.
3. The deletion test: imagine the module gone. If its complexity reappears in every caller, it earns its place; if nothing gets harder, it does not.
4. Put a seam where something really varies or sits outside your control: network, clock, file system, third-party service. Add none for a single implementation that nothing replaces.
5. Test through the interface. Wanting to test past it means the module has the wrong shape.
6. Pass dependencies in, and return results instead of changing things out of sight.
7. For an interface that will be hard to change, sketch two or three different shapes and put the choice to the user with a recommendation.

Rules 1, 4 and 6 get a good and a bad example in pseudocode. Rule 7 lets the agent give each shape to a subagent when the host supports one.

Run alone, the skill works on a module or area the user names, and asks when they name none. For new code it proposes the interface and its seams. For existing code it lists numbered candidates, each with what is wrong, the proposed change and what happens to the tests, and says which one it would do first. Tests are written at the new interface and the old ones deleted. It changes no file, and a candidate the user picks becomes a task to shape.

The workflow skill gets one sentence in step 2 and one in step 3, in both files that describe the steps. The review gets two lines in its smell list.

Changed on 2026-11-28, found in the review of ticket 1:

- **Seam** is defined as a place where what sits behind an interface can be swapped without editing its callers; a test puts a stand-in there. The first definition made every interface a seam, which contradicted rule 4: a rule that says to add no seam needs a seam to be something a module can lack. Rule 5 now says that callers and tests meet a module at its interface.
- Rule 4 lists network, clock, randomness and third-party services, the same list as `metacoding-tdd`, which prefers a real temporary directory to a stand-in for the file system.
- Rule 6 applies to a dependency that sits behind a seam. Applied to every dependency it would create the seams rule 4 forbids.
- The rule texts say a little more than the one-line rules above, and it is kept because each rule needs it to hold in use: depth is judged at the interface; a module that fails the deletion test is merged into its caller or into the module it passes calls to; a seam is real when two things do sit behind it; the two or three interfaces of rule 7 differ in kind.
- The build moment is stated in full, as the interview agreed it: when the interface to test through is unclear or missing, and when restructuring once the behaviors are green.

## Decisions made

- The guidance is a new companion skill, `metacoding-design`. A reference file of the workflow skill is out of reach when a companion runs alone, and paragraphs in three skills would state the same rules three times.
- It is used at four moments: shape's solution step, before the first TDD loop, the review, and on its own.
- Only the workflow skill names it, as it does for every other companion. `metacoding-shape` and `metacoding-tdd` are unchanged.
- The design skill owns the rules and the fixes. The review owns two symptoms to look for in a diff, and they stay follow-ups for the user.
- No decision record: nothing here is hard to reverse.

## Terms

None for this repo's glossary. The four terms are the skill's own vocabulary and live in the skill.

## Assumptions

- Added on 2026-11-28: the hard-coded counts of missing files in `test/unit/update-command.test.ts` are computed from its list of companion skills.
- Lines that count the skills, such as "five skills" and "the other four", are reworded without a number, so the next branch that adds a skill has nothing to recount.
- `_meta/system-documentation.md` gains the standing fact that only the workflow skill names other skills.
- The main checkout's own `.claude/skills` install is not refreshed from this branch; that happens after a merge.
- This spec and the backlog change are committed first, then one commit per ticket, with a pause for the user's go between tickets.

## Test intent

One content test per term, rule, example pair and pointer, each written first and seen failing, with heading guards. The installer tests prove the sixth skill is installed for every agent and that it references no `references/` or `assets/` file.

## Tickets

Changed on 2026-11-28, before the build: the ticket "The workflow says when to use it" is folded into ticket 1. An existing installer test requires the workflow rules to name every skill in the installer's list, so the skill cannot be installed in one ticket and named by the workflow in a later one. The scope is unchanged; the tickets after it are renumbered.

- [x] **1. The design skill, installed, listed, and named by the workflow**
  - Success criteria: the first, second and fourth success criteria above. The skill is in the skill tables and folder trees of the docs and in the CHANGELOG, and the system documentation states who names other skills.
  - Test intent: the skill is installed for all three agents, with `agents/openai.yaml` for Codex. It states each term with its words to avoid, each of the seven rules, and both examples for rules 1, 4 and 6. Step 2 and step 3 name `metacoding-design` and its condition, in both the workflow skill and its workflow rules.
  - Blocked by: none.
- [ ] **2. Running the skill alone**
  - Success criteria: the third success criterion above.
  - Test intent: it works on what the user names and asks when nothing is named; new code gets an interface and its seams; existing code gets numbered candidates with a first pick; tests move to the new interface; no file is changed; a picked candidate becomes a task to shape.
  - Blocked by: 1.
- [ ] **3. Two design smells in the review**
  - Success criteria: the fifth success criterion above.
  - Test intent: the smell list has both lines, and they fall under the existing follow-up rule.
  - Blocked by: none.
