---
name: metacoding-onboard
description: Record once where a repo keeps its tracker, specs, glossary, and decision records, in a project map that later sessions read instead of working the places out again. Use when the metacoding skills are new to a repo, when the user asks to onboard the repo, when the metacoding workflow reports that the repo has no project map, or when one of those places has moved.
---

# Onboard

Run this once per repo, and again when one of the places moves. It ends in a project map: a short file that says where this repo keeps its tracker, its specs, its glossary, and its decision records, so that no later session has to work the places out again. The metacoding workflow and the `metacoding-shape` skill read that file.

## The project map

The project map is the file `.metacoding/project.md`, at the same path in every repo. It is committed with the repo, so every clone and every agent reads the same answers.

```text
# Project map

Where this repo keeps its records. Written by the `metacoding-onboard` skill; run it again to change a line.

- Tracker: <GitHub issues, a file path, or none: the checklist in each spec>
- Specs: <folder>
- Glossary: <file>
- Decision records: <file or folder>
```

Keep the four labels as they are, so that a reader finds a place by its label. Write each path from the repo root, starting with `/`.

## 1. Look

Find out what the repo already has before asking anything.

- Tracker: the git remote and whether its issues are in use, or a task list or TODO file
- Specs: a folder of specs, proposals, or design documents
- Glossary: a glossary file, or a section of terms in the docs
- Decision records: a decisions file, or a folder with one file per decision
- Instruction file: the file your agent loads at the start of every session, such as `CLAUDE.md` or `AGENTS.md`, which the pointer in step 2 needs

For each place, note whether you found it and when it last changed. A tracker or file that nobody has touched for a long time may no longer be in use.

## 2. Ask

Put the places to the user in one round of numbered questions, each with a recommended place and a one-line reason. Use the question format of the `metacoding-shape` skill, so that the user can answer the round in one line.

Recommend what you found. When two candidates compete, such as an issue tracker and a task file that has gone quiet, name both and recommend one: which of them is kept current is the user's decision.

For a place the repo does not have, recommend the default: the place the `metacoding-shape` skill uses in a repo that has none. That skill names the defaults. Load it by name, or read `../metacoding-shape/SKILL.md`, which is installed next to this skill's folder.

In an empty folder all four recommendations are the defaults, and the user can confirm the round in one line.

### The pointer

A session that runs no metacoding skill does not know the project map exists. A pointer fixes that: one line in the instruction file your agent loads at the start of every session.

```text
This repo's tracker, specs, glossary, and decision records are listed in `.metacoding/project.md`.
```

Offer it as the last question of the round, after the four places.

- When the repo has no such file, say so instead of asking, and create none. The user can add one and run this skill again.
- When the file already has the line, leave it as it is and skip the question.
- The line gives the path and nothing else: the places themselves stay in the project map alone.

## 3. Write

Write the project map only after the user has confirmed the round. Nothing is written before that.

Record the places and create none of them. A glossary, a decisions file, or a specs folder that does not exist yet is created by the `metacoding-shape` skill when a task first needs it, at the path recorded here.

Add the pointer only when the user said yes to it, and only to a file the repo already has.

The project map is meant to be committed. Commit it when the user has you make commits; otherwise tell them the file is waiting to be committed.

## 4. Get the user started

Close by telling the user how to work from here, in a few lines:

- What you wrote: the project map with its four lines, and the pointer when you added it.
- How to start a task: ask for the `metacoding-workflow` skill.
- What each metacoding skill is for, one line each, this one left out.

Take each skill's name and purpose from the description at the top of its `SKILL.md`, in the `metacoding-*` folders installed next to this skill's folder. Keep no list of your own, so that a skill added later is not left out.

## Running it again

When the repo already has a project map, read it first, then look as in step 1 and compare. Show the user the current project map, name each line whose place you could not find, and ask what changed, in the same kind of round. A place that is recorded but not created yet is not an error.

Rewrite the file only after they confirm, and change only the lines they changed. Offer the pointer again when the instruction file lacks it.

Close as step 4 describes, with what changed in place of what you wrote.
