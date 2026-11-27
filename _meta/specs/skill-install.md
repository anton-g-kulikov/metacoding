# Feature spec: Skill install

- ID prefix: INSTALL

`metacoding init` and `metacoding update` put the packaged skills into a project. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The CLI installs every packaged skill into the skills folder of the chosen agent, one folder per skill. Each folder holds the skill file, and for Codex an interface file as well. `update` brings an existing install to the packaged set and adds a skill the install lacks.

## Stories

### CLI user

#### Get the new skill with the others

As a CLI user, I want every packaged skill installed, so that the workflow finds the skills it names.

```gherkin
Scenario: INSTALL-1 installs the spec skill
  Given a project
  When I install or update the skills for any agent
  Then metacoding-spec is installed with the other skills
```
