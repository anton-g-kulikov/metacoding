# Architecture Decisions

## 2026-11-27: Shape creates specs and tickets even where the repo tracks work nowhere

**Decision.** When a shaped task has more than one ticket or a decision worth recording, `metacoding-shape` writes a spec to `/_meta/specs/` and lists the tickets in it, unless the repo already has a place for either.

**Alternatives.**

- Keep the confirmed scope summary in the conversation and create no task record in a repo that lacks one. This was the rule until this decision.
- Write a spec for every task, whatever its size.

**Why.** A scope that lives only in a conversation is gone when the session ends. A later session, or a review running in a fresh context, then has nothing to check the work against, which happened during the review of the companion-skills change. A spec for every one-line fix would be clutter, so the threshold is a count the agent cannot argue away: more than one ticket, or any recorded decision. A separate test document is still not created; test intent lives in the spec and the tests.

**Amended 2026-11-28.** The record is now called a task spec, the `metacoding-spec` skill writes it, and its default place is `/_meta/specs/tasks/`. For a task with stories, scenarios took the place of test intent. The threshold and the reason for it stand. See the entries of 2026-11-28.

## 2026-11-27: Decision records are written at the end of shape

**Decision.** A decision marked `[record]` is written to this file when the user confirms the scope summary, before the build starts. The artifact step amends an entry the build proved wrong.

**Alternatives.**

- Write the records in the artifact step, once the work is done. This was the rule until this decision.

**Why.** The decision is made when the user confirms it, and the build should follow a decision that is already on record, together with the spec that refers to it. Writing afterwards avoids recording a decision that did not survive the build, but an amended entry tells a future reader more than a missing one.

## 2026-11-27: Update reads the init answers back from project-context.md

**Decision.** `metacoding update` takes the project name, description, tech stack and project type from the installed `references/project-context.md` of each vendor, and falls back to project detection for a value it cannot find. The labels of those four lines are a format that `update` depends on.

**Alternatives.**

- Rebuild the file from detection and fixed defaults on every update. This was the behavior until this decision.
- Have `init` write the answers to a separate config file that `update` reads.

**Why.** Rebuilding from detection replaced what the user entered and reported the file as locally edited on every update. A config file would be the cleaner store, but installs made before it existed have only `project-context.md`, so they would need a migration that reads that file anyway. Reading it directly fixes every existing install with no new file. The cost is that renaming one of the four labels in the template now needs a reader for the old label.

**Amended 2026-11-27.** "Every existing install" was too wide. A 2.0.x Claude Code install keeps its project context in `.claude/metacoding-workflow/references/`, not in the skill folder, so `update` also reads that file when it migrates the layout. The labels are the same in both places.

## 2026-11-28: The project map is a committed file of its own

**Decision.** `metacoding-onboard` writes where a repo keeps its tracker, specs, glossary and decision records to `.metacoding/project.md`, a committed file at the same path in every repo. The skills read it by path. With the user's yes, the agent's own instruction file gets one line that points to it and holds nothing else.

**Alternatives.**

- A marked section in the root `CLAUDE.md`, which was the first suggestion.
- A marked section in the root `AGENTS.md`.
- The installed `references/project-context.md`, next to the `init` answers.

**Why.** The skills are installed for three agents. Claude Code loads `CLAUDE.md` on its own and Codex loads `AGENTS.md`, so a section in either file reaches only some of them, while every agent can read a file by path. A file of its own also needs no merging into a file the user owns, and it can be written by the agent alone, so it works for an install that never ran the CLI. The installed `project-context.md` is ignored by git, exists once per agent, and is rewritten by `update`, so answers kept there would not reach a teammate or a fresh clone. The path cannot be under `/_meta`, because a repo that keeps its docs elsewhere has no such folder, and this file is where a session learns that. The cost is that a session running no metacoding skill does not know the file exists; the one-line pointer is there for that case.

**Amended 2026-11-28.** The decision left out a limit that was agreed with it: the pointer line goes only into an instruction file the repo already has. Onboarding creates no such file, so a repo without one, like this one, has the project map and no pointer.

## 2026-11-28: A new rule from a retro defaults to /_meta/coding-standards.md

**Decision.** When `metacoding-retro` proposes a new rule and the repo has no file that holds its standards, the rule goes to `/_meta/coding-standards.md`, which the retro proposes creating. A repo that already keeps its standards somewhere, an agent instruction file included, keeps using that place.

**Alternatives.**

- Write the rule to an agent instruction file at the root, `AGENTS.md` or `CLAUDE.md`, and create the file when it is missing.
- Write the rule into the installed metacoding skills.

**Why.** The skills are installed for three agents, and each agent loads a different instruction file on its own, so a rule in one of them reaches one agent. `metacoding-review` already reads the repo's contributor and style docs, so a rule in one file under `/_meta` is enforced for all three with no new wiring. An instruction file is also loaded into every session, where each added rule costs attention whether or not the task touches it; a standards file is read when a change is reviewed. The installed skills are git-ignored and `update` treats a local edit as a conflict, so a rule written there is neither shared nor safe. The cost is that an agent building a change does not see the rule unless it reads the standards while grounding; the review is where it is enforced.

## 2026-11-28: The repo root is the plugin for all three agents

**Decision.** Claude Code, Codex and Antigravity each install the skills as a plugin from the root of this repo. Each agent has its own manifest there, all of them read the one `skills/` folder, and every manifest carries the version of `package.json`.

**Alternatives.**

- A separate repo that holds only the plugin.
- A plugin folder generated from `skills/` by a build step.
- A plugin for Claude Code alone.

**Why.** All three plugin formats pick up a `skills/` folder at the plugin root, which this repo already has, so the skills keep one home and need no copy that can go stale. A separate repo or a generated folder would add a sync step for the same content. The skills are vendor-neutral, and each further agent costs one small manifest. The costs: an install copies the whole repo, about 1 MB, and not the skills alone; the version now lives in several files, which a test keeps equal; and once users install from this repo's address, moving the plugin breaks their updates.

## 2026-11-28: project-context.md is optional for the workflow skill

**Decision.** The workflow skill reads `references/project-context.md` when the file exists and looks the same facts up in the repo when it does not. The CLI keeps writing the file, and `update` keeps reading it back.

**Alternatives.**

- Remove the file everywhere: `init` stops asking its questions and `update` stops reading it back.
- Wait for the onboarding task to decide where a repo records its project facts.

**Why.** Only the CLI writes the file, so a plugin install pointed the agent at a file that was not there. Everything in it is a fact the agent can find in the repo. Removing it would undo the decision of 2026-11-27 above and change what every CLI install has on disk, for a question the onboarding task is still to settle. Making the file optional unblocks the plugin and leaves that question open: whatever place onboarding picks changes one line of the skill.

## 2026-11-28: A frozen task spec and a living feature spec

**Decision.** There are two kinds of spec. A task spec is the record of one shaped task, at `/_meta/specs/tasks/<date>-<slug>.md`, frozen once the task is done. A feature spec is the living document of one feature area, at `/_meta/specs/<area>.md`: how the area works today, and its user stories grouped by role with Given/When/Then scenarios. A ticket's scenarios are written into the feature spec when the ticket is done, in the ticket's commit.

**Alternatives.**

- Put the stories into the task spec only, and keep no living document.
- Write the feature spec when the scope summary is confirmed, before anything is built.
- File the living documents by role, or next to the code.

**Why.** A task spec is frozen, so stories kept only there go stale with the next task that changes the behavior, and a reader has to replay every task record in date order to learn what a feature does now. The task spec is still needed for the tickets, the scope lists and resuming, so it stays. Writing the feature spec per ticket means it states only what is built and has a test; written on confirmation, it would describe behavior that does not exist yet, and an abandoned task would leave it wrong. A story belongs to one feature area while a role cuts across all of them, so the files are per area and the roles are headings. The cost is that a scenario's text exists twice: as agreed, in the task spec, and as it is now, in the feature spec.

## 2026-11-28: A scenario is tied to its test by an ID in the test's name

**Decision.** Each scenario has an ID made of its feature area's prefix and a number, such as `UPDATE-3`. The test that proves it carries the ID in its name, or in a comment or tag where a name cannot hold it. No spec lists a test's path. The review reports a scenario as unproven when a search finds no test with its ID.

**Alternatives.**

- List the test file and test name next to each scenario in the spec.
- Make the scenarios executable feature files, run by a Gherkin runner.

**Why.** An ID survives renamed and moved files, and a text search finds it in any language. A path in a document goes stale on the first rename, and nothing fails when it does. Executable feature files are the stronger link, but they need a runner and step definitions per language, which most repos do not have and the skills cannot install; a repo that already runs feature files keeps them. The cost is that the link is only as good as the discipline of naming tests, so the TDD and review skills both carry the rule.

**Amended 2026-11-28.** "No spec lists a test's path" was too wide. A task spec names the files a task changes under In scope, test files among them. What no spec holds is a link from a scenario to the path of its test. The same day, the rule on unproven scenarios gained a second half: a scenario is also unproven when the test that carries its ID does not check what its "Then" says.

## 2026-11-28: The interview and the spec writing are two skills

**Decision.** `metacoding-shape` runs the interview and ends in a list of decisions, terms and assumptions. A new skill, `metacoding-spec`, turns settled decisions into the scope summary, gets it confirmed, and owns every written record and its default place: glossary terms, decision records, task specs and feature specs. Workflow step 2 stays one step that uses the two in order.

**Alternatives.**

- Keep one skill and add a rule that it stops after the decisions when the user only asked to be questioned.
- Make step 2 two workflow steps and renumber the rest.

**Why.** One skill did four jobs, so it could not be used as a plain interview, and the stories, feature specs and ticket rules roughly double the spec-writing text. Split, each skill has one job and the record rules have one home. A stop-early rule would have been a smaller change, but it leaves the interview skill carrying rules it does not use in that mode. Step 2 stays one step because the user still confirms once, and renumbering would change every rule that names steps 3 to 7. The cost is a sixth installed skill, and that the entry of 2026-11-27 on decision records now describes the spec skill where it says "shape".
