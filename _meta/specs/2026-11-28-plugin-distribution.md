# Spec: Plugin distribution

- Status: in progress

## Goal

The metacoding skills can be installed as a plugin in Claude Code, Codex and Antigravity, straight from this repo and without the `metacoding` CLI.

## Success criteria

- The workflow skill works when `references/project-context.md` does not exist.
- The repo is a valid Claude Code plugin and its own marketplace, checked with `claude plugin validate --strict`.
- The repo carries a Codex manifest and marketplace file and an Antigravity manifest, in the shapes their docs give.
- Every manifest has the same version as `package.json`, and a test fails when one differs.
- The plugin ships exactly the skills the CLI installs, and a test fails when the two lists differ.
- The README leads with the plugin install for each agent and keeps the CLI as the second way.
- `npx jest`, `npm run lint` and `npm run build` pass after each ticket.

## In scope

- One sentence in "Start Here" of the workflow skill, and one on how a companion skill is named in a plugin install.
- The manifest files: one for each agent, and a marketplace file for Claude Code and for Codex.
- A new test file for the manifests, and one content test for the new skill sentences.
- `README.md`, `CHANGELOG.md`, `_meta/system-documentation.md`.
- This task's own records: this spec, two decision records, two glossary terms, and the backlog.

## Out of scope

- Any change to `src/`. The CLI behaves as before and still writes `project-context.md`.
- Removing `project-context.md`, or deciding where a repo records its project facts. That belongs to the onboarding task.
- Renaming the skills.
- Submitting the plugin to any store or directory.
- The version bump to 3.0.0, the npm release, pushing, and a pull request.
- The third-party `npx skills add` installer.
- Moving the CLI's Codex install from `.codex/skills/` to `.agents/skills/`. It is a backlog item of its own.

## Solution

- **Skill text.** "Start Here" step 1 tells the agent to read `references/project-context.md` when it exists and, without it, to find the project's type, tech stack, and test and build commands in the repo. A second sentence says that a companion skill's name carries the plugin's prefix in a plugin install, such as `metacoding:metacoding-shape`.
- **Plugin root.** The repo root is the plugin for all three agents. Each one reads the `skills/` folder at the plugin root, so nothing is moved, copied or generated, and no manifest lists the skills.
- **Claude Code.** A plugin manifest, and a marketplace file whose one entry points at the repo root, both in `.claude-plugin/`.
- **Codex.** A `plugin.json` at the root, and a marketplace file in `.agents/plugins/` that points at the repo's git URL.
- **Antigravity.** A manifest in `.antigravity-plugin/`. It installs from the GitHub URL and needs no marketplace file.
- **README.** The install section gives each agent's commands, how to update, and the prefixed skill names. It says that the Codex and Antigravity forms are not yet tried on a real install, that a project uses the plugin or the CLI and not both, and that the Codex IDE extension needs the CLI.

## Decisions made

- The repo root is the plugin for all three agents, with one manifest per agent and the version taken from `package.json`. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- `project-context.md` is optional for the workflow skill, and the CLI keeps writing it. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- This task does not wait for the onboarding task. Whatever place onboarding picks for project facts changes one line of "Start Here".
- The CLI stays unchanged as the second way to install.
- The plugin and its marketplace are both named `metacoding`. The skills keep their names, so a plugin install shows them as `metacoding:metacoding-workflow` and so on.
- Codex gets a root `plugin.json` rather than `.codex-plugin/plugin.json`, which its docs call a compatibility fallback.
- Plugin users get one update per release: the manifests carry a version, so a commit to `main` alone is not an update.
- The third-party installer is left out of the README.

## Terms

- **Plugin install**: the skills as an agent installs them from this repo with its own plugin mechanism. Avoid: extension, package.
- **CLI install**: the skills as `metacoding init` copies them into a project. Avoid: local install, project install.

## Assumptions

- The plugin installs from `main`, so the README's commands work only once this branch is merged and pushed.
- The manifests carry the current version until the release bump, which then changes each of them together with `package.json`. The test catches a missed one.
- Only Claude Code is installed where this was built. The Codex and Antigravity files follow their docs as read on 2026-11-27 and were not run. A live load of the Claude Code plugin was not run either; the manifests were checked with `claude plugin validate --strict`.
- Commits follow the workflow: the records on their own first, then one commit per ticket, with a pause for the user's go between tickets.
- No `src/` file changes, so the tracked files under `lib/` are not rebuilt.

## Test intent

Each success criterion that a test can prove gets one, written first and seen failing. The README and system-documentation changes are checked by review. `claude plugin validate --strict` is a manual check, because the test run has no `claude`.

## Tickets

- [x] **1. The workflow skill works without `project-context.md`**
  - Success criteria: "Start Here" tells the agent to read the file when it exists and to look the facts up otherwise. The skill says how a companion skill is named in a plugin install. The system documentation and the changelog say so too.
  - Test intent: a content test pins both new sentences under their headings and fails on the text as it was.
- [x] **2. Claude Code plugin**
  - Success criteria: the manifest and the marketplace file exist and pass `claude plugin validate --strict`. The manifest's version equals the one in `package.json`. The folders under `skills/` match the CLI's skill list, and each skill's `name` matches its folder. The README leads with the Claude Code plugin install.
  - Test intent: a new manifest test file proves the name, the version match, the marketplace entry, the skill-list match and the name-to-folder match.
  - Changed on 2026-11-28, found in the review of this ticket: `test/unit/skill-manager.test.ts` already proves that the folders under `skills/` are the CLI's skill list, so the new file does not repeat it.
- [ ] **3. Codex and Antigravity plugin forms**
  - Success criteria: the Codex manifest and marketplace file and the Antigravity manifest exist in the documented shapes, with the same name, version and description as the Claude Code manifest. The README gives both installs and says they are untried. The Claude Code validation still passes with the root `plugin.json` present.
  - Test intent: the manifest tests extend to all three manifests and both marketplace files.
