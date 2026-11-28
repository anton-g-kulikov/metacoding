# Glossary

**Task**: the whole request the workflow takes from grounding to close. Avoid: ticket, job.

**Shape**: settling a task's open decisions with the user before any change; the name of workflow step 2 and of the `metacoding-shape` skill. Avoid: interview, which names the method shape uses.

**Spec**: the written record of a shaped task: its confirmed scope summary in one file, with its tickets or links to them. A one-ticket task with no decision to record has none. Avoid: PRD, design doc, plan.

**Ticket**: one piece of a task's solution that can be built, verified, reviewed, and committed on its own. Each ticket is a vertical slice. Avoid: slice as the name of the unit, task, story.

**Onboarding**: a coding agent recording once where a repo keeps its tracker, specs, glossary and decision records; the main job of the `metacoding-onboard` skill. Avoid: init, setup, and using the word for introducing a person to metacoding, which is getting started.

**Project map**: the file onboarding writes, `.metacoding/project.md`, which says where the repo keeps those records. Avoid: project context, which is the file of `init` answers.

**Retro**: looking back at a finished task to turn its mistakes into lasting changes; the name of the `metacoding-retro` skill. Avoid: retrospective, post-mortem.

**Lesson**: a mistake that passed the retro's bar, together with the change proposed for it. Avoid: finding, which is the review's word for a problem in a diff; learning, takeaway.

**Plugin install**: the skills as an agent installs them from this repo with its own plugin mechanism. Avoid: extension, package.

**CLI install**: the skills as `metacoding init` copies them into a project. Avoid: local install, project install.
