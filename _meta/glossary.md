# Glossary

**Task**: the whole request the workflow takes from grounding to close. Avoid: ticket, job.

**Shape**: workflow step 2: settling a task's open decisions with the user and agreeing its scope summary before any change. The `metacoding-shape` skill runs the interview; the `metacoding-spec` skill writes the scope summary and the records. Avoid: interview, which names the method the first skill uses.

**Task spec**: the written record of one shaped task: its confirmed scope summary in one file, with its tickets or links to them, frozen once the task is done. A one-ticket task with no decision to record has none. Avoid: spec on its own, PRD, design doc, plan.

**Feature spec**: the living document of one feature area: how the area works today, and its stories grouped by role. It is corrected whenever a task changes the area's behavior. Avoid: spec on its own, requirements, PRD.

**Feature area**: a part of the product a user would name, such as a command or a skill. Each has one feature spec. Avoid: module, component.

**Ticket**: one piece of a task's solution that can be built, verified, reviewed, and committed on its own. Each ticket is a vertical slice. Avoid: slice as the name of the unit, task, story.

**Onboarding**: a coding agent recording once where a repo keeps its tracker, specs, glossary and decision records; the main job of the `metacoding-onboard` skill. Avoid: init, setup, and using the word for introducing a person to metacoding, which is getting started.

**Project map**: the file onboarding writes, `.metacoding/project.md`, which says where the repo keeps those records. Avoid: project context, which is the file of `init` answers.

**Retro**: looking back at a finished task to turn its mistakes into lasting changes; the name of the `metacoding-retro` skill. Avoid: retrospective, post-mortem.

**Lesson**: a mistake that passed the retro's bar, together with the change proposed for it. Avoid: finding, which is the review's word for a problem in a diff; learning, takeaway.

**Plugin install**: the skills as an agent installs them from this repo with its own plugin mechanism. Avoid: extension, package.

**CLI install**: the skills as `metacoding init` copies them into a project. Avoid: local install, project install.

**Role**: a kind of user a story is for. Each role is a term in this glossary. Avoid: persona, actor.

**Story**: one thing a role wants, written as "As a …, I want …, so that …", with its scenarios. Avoid: ticket, requirement.

**Scenario**: one Given/When/Then case of a story, with an ID that the test proving it carries. Avoid: acceptance criterion, test case.

**Test seam**: the public interface a story's scenarios are tested through.

**Developer** (role): the person who gives a coding agent a task and answers its questions. The skills call this person "the user".

**CLI user** (role): the person who runs `metacoding init` or `metacoding update`.
