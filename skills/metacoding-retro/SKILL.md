---
name: metacoding-retro
description: Look back at a finished task and turn its mistakes into lasting changes, such as a check, a rule, or a doc fix, that prevent the same mistake in the next task, each proposed to the user before anything is changed. Use when the user asks for a retro, a retrospective, or what to learn from a task or session, or when the metacoding workflow has closed the last ticket of a task.
---

# Retro

A retro looks back at a finished task and turns its mistakes into lasting changes, so that the same mistake is prevented, or caught earlier, in the next task. It ends in a list of proposals for the user. It changes no file until the user has answered them.

Run it once the task's work is closed: after the last ticket is committed or handed off. Run it earlier when the user asks.

## What to read

Collect the task's mistakes from what is on record before you trust your memory of it:

- Review findings that had to be fixed.
- Corrections from the user: an instruction they had to repeat, an approach they rejected, work they asked to have redone.
- Changes to the agreed scope made during the build, such as dated additions to the spec.
- Decision records amended because the build proved them wrong.
- Checks that failed for a reason that could have been foreseen: a test, the linter, the build.

When the conversation that did the work is gone, read the spec and the task's commits, then ask the user what went wrong.

A retro is about mistakes. How fast the work went and what it cost to run are not its subject.

## The bar

A mistake becomes a lesson only when all three are true:

1. **It cost something.** Work was redone, or the mistake was caught late: by the review, by the user, or after a commit.
2. **It would happen again.** Another task in this repo would likely run into it. A one-off slip does not count.
3. **A change would stop it.** You can name one concrete change that prevents the mistake or catches it earlier.

Expect few lessons: most tasks have none or one. When no mistake passes the bar, say "Nothing worth keeping" in one line and stop.

## From cause to change

For each lesson, first say why nothing stopped the mistake: no check covered it; a rule was wrong, unclear, or stated in two places; no rule existed; a term had no agreed meaning; a decision was never written down; a checklist lacked a step.

Then propose one change, the first in this list that fits:

1. **An automated check**, when the mistake is mechanical: a test, a lint rule, or a step in the command the repo runs before a commit. Read the repo's existing checks first. A check that exists and is not run is the thing to fix.
2. **A fix to an existing rule or doc** that was wrong, unclear, or stated in two places. When two places disagree, keep the rule in one and make the other point to it.
3. **A new rule** in the repo's standards, when the mistake is a judgment call that no check can catch.
4. **A glossary term or a decision record**, when the mistake came from a term with no agreed meaning or a decision that was never written down.
5. **A step in a checklist**, when a repeated procedure, such as a release, missed a step.

A check comes first because it cannot be forgotten, and a rule can. A fix comes before a new rule because each fact should have one home.

## Where a rule goes

Find where the repo already keeps its standards: a contributor or style doc, a coding standards file, or an agent instruction file. Put the rule there, next to the rules it belongs with.

When the repo has no such file, propose creating `/_meta/coding-standards.md`, and create it with the first rule the user approves. One file under `/_meta` serves every agent that works in the repo, and a review reads it.

Write a rule as one or two sentences: what to do, and why. Leave out the date and the story of the task it came from.

A glossary term or a decision record goes where the repo keeps its glossary and its decision records, in the format of the entries already there. When the repo keeps none, name the file you would create in the proposal.

## Installed metacoding skills

Never edit an installed metacoding skill: a folder named `metacoding-*` inside an agent's skills folder, such as `.claude/skills/`. Git ignores those folders by default, and the next `metacoding update` reports a local edit as a conflict, so a change made there is neither shared nor safe. This holds even when the repo commits those folders.

- When the lesson is about how the workflow should run in this repo, propose a rule in the repo's standards.
- When a metacoding skill itself is at fault, say so and draft a short issue for the metacoding project: what happened, what the skill said, and what it should say. The user decides whether to file it.

Any other skill that the repo tracks in git, such as its own skills or the source of a skill package, is edited like any other file.

## The proposals

Send the lessons as one numbered list, the most costly mistake first. The user can answer the whole list in one line, such as "1 do, 2 skip". A "yes" to a lesson accepts your recommendation for it.

```text
L1. <short title>
What happened: <the mistake, and where it shows: a review finding, a commit, a correction>
Why nothing stopped it: <the cause>
Change: <the check, fix, or rule, worded exactly enough to apply>
Where: <the file or the check it goes to>
Recommended: do | skip, because <one-line reason>
```

Recommend "skip" for a lesson whose change would cost more than the mistake does.

When you cannot reach the user directly, for example when running as a subagent, return the list as your result and stop there. Continue when the answers are sent back.

## After the answer

Apply only the lessons the user's answer says to do.

- **A text edit**, meaning a rule, a doc fix, a glossary term, a decision record, or a checklist step: make it now.
- **A small check**, meaning one test or one line of lint or build configuration: build it now. Watch it fail on the original mistake, either against the code as it was before the fix or with the mistake put back for one run. Then watch it pass. A check that was never seen failing proves nothing.
- **Anything larger**: leave it out of the retro. Queue it as its own task where the repo tracks work. Where it tracks work nowhere, name it in your report.

When commits are in scope, commit each lesson you applied on its own, apart from the task's commits, and say in the message which mistake it answers.

Close with a short report: what changed and where, what was queued, and what the user skipped. Keep no log of the retro: the changes, with their commit messages where there are commits, are the record.
