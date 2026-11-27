# Architecture Decisions

## 2026-11-27: Shape creates specs and tickets even where the repo tracks work nowhere

**Decision.** When a shaped task has more than one ticket or a decision worth recording, `metacoding-shape` writes a spec to `/_meta/specs/` and lists the tickets in it, unless the repo already has a place for either.

**Alternatives.**

- Keep the confirmed scope summary in the conversation and create no task record in a repo that lacks one. This was the rule until this decision.
- Write a spec for every task, whatever its size.

**Why.** A scope that lives only in a conversation is gone when the session ends. A later session, or a review running in a fresh context, then has nothing to check the work against, which happened during the review of the companion-skills change. A spec for every one-line fix would be clutter, so the threshold is a count the agent cannot argue away: more than one ticket, or any recorded decision. A separate test document is still not created; test intent lives in the spec and the tests.

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
