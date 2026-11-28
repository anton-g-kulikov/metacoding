import YAML from 'yaml';
import {
  METACODING_SKILLS,
  SkillManager,
  WORKFLOW_SKILL,
} from '../../src/services/skill-manager';
import { AgentVendor } from '../../src/types';

const skillsDirs: Record<AgentVendor, string> = {
  codex: '.codex/skills',
  'claude-code': '.claude/skills',
  antigravity: '.agents/skills',
};

async function installFor(vendor: AgentVendor, projectType = 'typescript') {
  const files = await new SkillManager().generateInstallationFiles({
    name: 'demo-app',
    description: 'Demo application',
    techStack: ['TypeScript'],
    projectType,
    vendor,
  });
  const read = (relativePath: string): string => {
    const file = files.find(
      (candidate) => candidate.path === `${skillsDirs[vendor]}/${relativePath}`
    );
    if (!file) {
      throw new Error(`Not installed: ${relativePath}`);
    }
    return file.content;
  };

  return { files, read };
}

/** The parsed frontmatter of a SKILL.md, after checking that the block is there. */
function frontmatterOf(skillFile: string): Record<string, unknown> {
  const opening = '---\n';
  const end = skillFile.indexOf('\n---\n', opening.length);

  expect(skillFile.startsWith(opening)).toBe(true);
  expect(end).toBeGreaterThan(-1);
  // An agent that cannot parse the block loads the skill with no description.
  return YAML.parse(skillFile.slice(opening.length, end));
}

/** A document from one heading up to the next; fails when either heading is missing. */
function sectionOf(document: string, heading: string, nextHeading?: string): string {
  expect(document).toContain(heading);
  if (nextHeading) {
    expect(document).toContain(nextHeading);
  }
  return document.slice(
    document.indexOf(heading),
    nextHeading ? document.indexOf(nextHeading) : undefined
  );
}

/** The fenced block that starts with the given opening. Fails when there is none. */
function codeBlock(doc: string, opening: string): string {
  const start = doc.indexOf(opening);
  expect(start).toBeGreaterThan(-1);
  return doc.slice(start, doc.indexOf('```', start + 3));
}

describe('installed skill content: durable artifacts', () => {
  test('the layout reference prescribes a glossary under /_meta', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');

    expect(layout).toContain('`/_meta/glossary.md`');
    expect(layout).toContain('## Glossary');
  });

  test('the layout reference says where specs and tickets go, and keeps no separate test document', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const prescribed = layout.slice(
      layout.indexOf('## MECE Documentation Architecture'),
      layout.indexOf('## Project Map')
    );
    const records = layout.slice(
      layout.indexOf('## Specs, Tickets, and Test Records'),
      layout.indexOf('## Decision Records')
    );

    expect(layout).toContain('## MECE Documentation Architecture');
    expect(layout).toContain('## Project Map');
    expect(layout).toContain('## Specs, Tickets, and Test Records');
    expect(layout).toContain('## Decision Records');
    expect(prescribed).toContain('`/_meta/specs/`');
    expect(prescribed).not.toContain('project-task-list.md');
    expect(prescribed).not.toContain('test-documentation.md');
    expect(records).toContain('`metacoding-spec` skill decides which tasks need a task spec');
    expect(records).toContain('where the repo already keeps task specs');
    expect(records).toContain('`/_meta/specs/tasks/<date>-<slug>.md`');
    expect(records).toContain("go to the repo's tracker when it keeps one current");
    expect(records).toContain('checklist in the task spec');
    expect(records).toContain('do not create one');
    expect(layout).not.toContain('Create neither');
    expect(layout).not.toContain('test documentation belongs under `/test`');
  });

  test('a repo without a tracker keeps the tickets as a checklist in the task spec', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const section = adaptation.slice(
      adaptation.indexOf('## Missing Task Tracking'),
      adaptation.indexOf('## Missing Feature Specs')
    );

    expect(adaptation).toContain('## Missing Task Tracking');
    expect(adaptation).toContain('## Missing Feature Specs');
    expect(section).toContain('checklist in the task spec');
    expect(section).toContain('`/_meta/specs/tasks/<date>-<slug>.md`');
    expect(section).toContain('needs no task spec');
    expect(section).toContain('the confirmed scope summary in the conversation is the record');
  });

  test('the layout reference sets a three-part bar for decision records', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = layout.slice(layout.indexOf('## Decision Records'));

    expect(layout).toContain('## Decision Records');
    expect(section).toContain('`/_meta/architecture-decisions.md`');
    expect(section).toContain('all three');
    expect(section).toContain('Hard to reverse');
    expect(section).toContain('Surprising without context');
    expect(section).toContain('A real trade-off');
  });

  test('no vendor install ships or mentions the test-plan template', async () => {
    for (const vendor of Object.keys(skillsDirs) as AgentVendor[]) {
      const { files } = await installFor(vendor);

      expect(files.filter((file) => file.path.endsWith('test-plan.md'))).toEqual([]);
      expect(
        files
          .filter((file) => file.content.includes('test-plan'))
          .map((file) => file.path)
      ).toEqual([]);
    }
  });

  test('no vendor install ships or mentions a language reference', async () => {
    const languages = ['typescript', 'javascript', 'node', 'react', 'python'];

    for (const vendor of Object.keys(skillsDirs) as AgentVendor[]) {
      // Each language is also a project type, which used to pick the references.
      for (const projectType of ['general', ...languages]) {
        const { files } = await installFor(vendor, projectType);

        for (const language of languages) {
          const languageFile = `references/${language}.md`;

          expect(
            files.filter((file) => file.path.endsWith(languageFile)).map((file) => file.path)
          ).toEqual([]);
          expect(
            files
              .filter((file) => file.content.includes(languageFile))
              .map((file) => file.path)
          ).toEqual([]);
        }
      }
    }
  });

  test('the project context lists each reference once, with no recommended section', async () => {
    const { read } = await installFor('codex');
    const context = read('metacoding-workflow/references/project-context.md');

    expect(context).toContain('## Required References');
    expect(context).not.toContain('## Recommended References');
    expect(context).not.toContain('{{');
    expect(context.split('`references/workflow-rules.md`')).toHaveLength(2);
    expect(context.split('`references/repository-organization.md`')).toHaveLength(2);
  });

  test('the task entry template carries the scope summary fields', async () => {
    const { read } = await installFor('codex');
    const template = read('metacoding-workflow/assets/templates/task-entry.md');
    const spec = read('metacoding-spec/SKILL.md');
    const summaryFields = [
      'Goal:',
      'In scope:',
      'Out of scope:',
      'Solution:',
      'Stories:',
      'Decisions made:',
      'Terms:',
      'Assumptions:',
      'Tickets:',
    ];

    for (const field of summaryFields) {
      expect(spec).toContain(`\n${field}`);
      expect(template).toContain(`- ${field}`);
    }
    expect(template).toContain('- Success criteria:');
    expect(template).toContain('- Test intent:');
    expect(template).toContain(
      'Give the stories, or the success criteria and test intent when the task has no stories.'
    );
  });

  test('settled terms are listed in both summaries and written only after confirmation', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const spec = read('metacoding-spec/SKILL.md');
    const terms = shape.slice(
      shape.indexOf('## Terms'),
      shape.indexOf('## Question format')
    );
    const summaryStart = spec.indexOf('```text\nScope summary\n');
    const summary = spec.slice(summaryStart, spec.indexOf('```', summaryStart + 3));

    expect(shape).toContain('## Terms');
    expect(shape).toContain('## Question format');
    expect(summaryStart).toBeGreaterThan(-1);
    expect(terms).toContain('list it under Terms in the decisions summary');
    expect(terms).toContain(
      'The `metacoding-spec` skill writes them to the glossary once its scope summary is confirmed.'
    );
    expect(summary).toContain('\nTerms:\n');
    expect(spec).toContain(
      'propose creating one there, by default at `/_meta/glossary.md`: confirming the summary approves it'
    );
    for (const skill of [shape, spec]) {
      expect(skill).not.toContain('straight away');
      expect(skill).not.toContain('before the scope summary is confirmed');
    }
  });

  test('the scope summary marks the decisions to record against a three-part bar', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');

    const summarySection = spec.slice(
      spec.indexOf('## The scope summary'),
      spec.indexOf('## Records written on confirmation')
    );

    expect(spec).toContain('## The scope summary');
    expect(spec).toContain('## Records written on confirmation');
    expect(summarySection).toContain('put `[record]` in front of each decision');
    expect(summarySection).toContain(
      'hard to reverse, surprising without context, and a real trade-off'
    );
    expect(summarySection).toContain(
      'Confirming the summary also approves writing those as decision records.'
    );
  });

  test('the spec skill writes the terms and the marked decisions once the summary is confirmed', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const records = spec.slice(
      spec.indexOf('## Records written on confirmation'),
      spec.indexOf('## The task spec')
    );

    expect(spec).toContain('## Records written on confirmation');
    expect(spec).toContain('## The task spec');
    expect(records).toContain('Once the scope summary is confirmed');
    expect(records).toContain('before any other file changes');
    expect(records).toContain('`/_meta/glossary.md`');
    expect(records).toContain("use the repo's own glossary if it keeps one elsewhere");
    expect(records).toContain('`/_meta/architecture-decisions.md`');
    expect(records).toContain("use the repo's own place if it keeps decision records elsewhere");
    expect(records).toContain('the date, the decision, the alternatives considered, and why this one won');
    expect(records).toContain(
      'amend the entry: keep its original text and add what changed and why'
    );
    expect(records).toContain('**The task spec.** Write it when the task needs one');
    expect(spec).not.toContain('once the work is done');
  });

  test('an instruction to proceed without questions stands in for the confirmation', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');

    expect(spec).toContain(
      'then continue. That instruction stands in for the confirmation.'
    );
  });

  test('the layout reference says records and terms are written on confirmation', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const decisions = layout.slice(
      layout.indexOf('## Decision Records'),
      layout.indexOf('## Glossary')
    );
    const glossary = layout.slice(
      layout.indexOf('## Glossary'),
      layout.indexOf('## Coding Standards')
    );

    expect(layout).toContain('## Decision Records');
    expect(layout).toContain('## Glossary');
    expect(layout).toContain('## Coding Standards');
    expect(decisions).toContain('writes the entry once the user confirms the summary');
    expect(decisions).toContain('holds the entry format and how to amend an entry');
    expect(decisions).not.toContain('once the work is done');
    expect(glossary).toContain('once the scope summary that lists it is confirmed');
    expect(glossary).not.toContain('at the moment its meaning is settled');
    expect(glossary).toContain('follow `references/platform-adaptation.md`');
  });

  test('a repo without a glossary gets one proposed in the scope summary', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const section = adaptation.slice(
      adaptation.indexOf('## Missing Glossary or Decision Records'),
      adaptation.indexOf('## Missing Coding Standards')
    );

    expect(adaptation).toContain('## Missing Glossary or Decision Records');
    expect(adaptation).toContain('## Missing Coding Standards');
    expect(section).toContain('propose `/_meta/glossary.md` in the scope summary');
    expect(section).toContain('once the summary is confirmed');
  });

  test('the workflow reads the glossary while grounding and amends decision records at the end', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const skill = read('metacoding-workflow/SKILL.md');
    const stepMarkers = [
      '1. Ground in the repository.',
      '2. Shape the task',
      '3. Build test-first.',
      '6. Update artifacts',
      '7. Close the loop.',
    ];
    const grounding = rules.slice(
      rules.indexOf('1. Ground in the repository.'),
      rules.indexOf('2. Shape the task')
    );
    const artifacts = rules.slice(
      rules.indexOf('6. Update artifacts'),
      rules.indexOf('7. Close the loop.')
    );

    for (const marker of stepMarkers) {
      expect(rules).toContain(marker);
    }
    expect(grounding).toContain('glossary');
    expect(grounding).toContain('decision records');
    expect(artifacts).toContain(
      'Amend a decision record the build proved wrong, as the `metacoding-spec` skill describes'
    );
    expect(artifacts).not.toContain('Write each decision marked');
    expect(skill).not.toContain('write the decision records the scope summary marked');
    expect(skill).not.toContain('bootstrap');
  });
});

describe('installed skill content: solution and tickets', () => {
  test('the scope summary states the solution and the tickets', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const summaryStart = spec.indexOf('```text\nScope summary\n');
    const summary = spec.slice(summaryStart, spec.indexOf('```', summaryStart + 3));

    expect(summaryStart).toBeGreaterThan(-1);
    expect(summary).toContain('\nSolution:\n');
    expect(summary).toContain('\nTickets:\n');
  });

  test('the workflow rules name the solution, the terms, and the tickets in the scope summary', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const summaryLine = rules
      .split('\n')
      .find((line) => line.includes('Close with the scope summary'));

    expect(summaryLine).toContain('solution');
    expect(summaryLine).toContain('terms');
    expect(summaryLine).toContain('tickets');
  });

  test('the solution names the approach and what changes', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = spec.slice(
      spec.indexOf('## Solution and tickets'),
      spec.indexOf('## The scope summary')
    );

    expect(spec).toContain('## Solution and tickets');
    expect(spec).toContain('## The scope summary');
    expect(section).toContain('the approach');
    expect(section).toContain('public interface');
  });

  test('the solution is sliced into tickets that are vertical slices', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = spec.slice(
      spec.indexOf('## Solution and tickets'),
      spec.indexOf('## The scope summary')
    );

    expect(spec).toContain('## Solution and tickets');
    expect(spec).toContain('## The scope summary');
    expect(section).toContain('built, verified, reviewed, and committed on its own');
    expect(section).toContain('vertical slice');
    expect(section).toContain('Give each ticket the scenarios it delivers.');
    expect(section).toContain('each builds on the ones before it');
  });

  test('an open choice of how to slice goes to the user as a decision', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = spec.slice(
      spec.indexOf('## Solution and tickets'),
      spec.indexOf('## The scope summary')
    );

    expect(spec).toContain('## Solution and tickets');
    expect(spec).toContain('## The scope summary');
    expect(section).toContain('put the cut to the user as a decision');
    expect(spec).toContain('how it is sliced into tickets');
  });

  test('the scope summary lists tickets in build order with what each delivers', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const summarySection = spec.slice(spec.indexOf('## The scope summary'));

    expect(spec).toContain('## The scope summary');
    expect(summarySection).toContain('number the tickets in build order');
    expect(summarySection).toContain('a title and the IDs of the scenarios it delivers');
    expect(summarySection).toContain(
      'In a task without stories, give each its success criteria and its test intent.'
    );
    expect(summarySection).toContain('For a one-ticket task, give the title alone');
  });

  test('a small task stays one ticket', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');

    expect(spec).toContain('A small task is one ticket');
  });
});

describe('installed skill content: the task spec', () => {
  test('a task spec is written after confirmation for more than one ticket or a marked decision', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain('Write a task spec when either is true');
    expect(section).toContain('The summary has more than one ticket.');
    expect(section).toContain('The summary has a decision marked `[record]`.');
    expect(spec).toContain('\n# Spec\n');
    expect(spec.slice(0, spec.indexOf('\n# Spec\n'))).toContain(
      'a task spec when the task has more than one ticket or a decision to record'
    );
  });

  test('a one-ticket task with no marked decision gets no task spec', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain('needs no task spec');
    expect(section).toContain('where the repo already tracks work');
    expect(section).toContain('the summary in the conversation is the record');
  });

  test("the task spec goes to the repo's own place or /_meta/specs/tasks", async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain('where the repo already keeps task specs');
    expect(section).toContain('`/_meta/specs/tasks/<date>-<slug>.md`');
    expect(section).toContain('`YYYY-MM-DD`');
  });

  test('the task spec holds a status, the scope summary fields, and the tickets', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');
    const formatStart = section.indexOf('```text\n# Task spec:');
    const format = section.slice(formatStart, section.indexOf('```', formatStart + 3));

    expect(spec).toContain('## The task spec');
    expect(formatStart).toBeGreaterThan(-1);
    expect(format).toContain('- Status: in progress');
    for (const heading of [
      '## Goal',
      '## In scope',
      '## Out of scope',
      '## Solution',
      '## Stories',
      '## Decisions made',
      '## Terms',
      '## Assumptions',
      '## Tickets',
    ]) {
      expect(format).toContain(`\n${heading}\n`);
    }
    expect(format).toContain('- [ ] 1. <title>\n  - Delivers:');
    expect(section).toContain('A one-ticket task spec lists its ticket by title alone.');
  });

  test("tickets go to the repo's tracker when it keeps one current, otherwise the task spec is the tracker", async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain('When the repo keeps a tracker current');
    expect(section).toContain('create the tickets there and link each one from the task spec');
    expect(section).toContain('the checklist in the task spec is the tracker');
  });

  test('a finished task spec is marked done and stays in place unchanged', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain("set the task spec's status to done");
    expect(section).toContain('leave the task spec in place and unchanged');
    expect(section).toContain("belong in the repo's system documentation");
  });

  test('the workflow leaves the records and the task spec to the spec skill', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(shaping).toContain(
      'Once the summary is confirmed, the `metacoding-spec` skill writes the settled terms to the glossary and the decisions marked `[record]` to the decision records, and a task spec when the task needs one.'
    );
    expect(shaping).toContain('For a task that needs none');
  });
});

describe('installed skill content: building ticket by ticket', () => {
  test('the workflow skill points to the ticket loop and its pause', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const steps = skill.slice(
      skill.indexOf('## Steps'),
      skill.indexOf('## Rules Between Steps')
    );

    expect(skill).toContain('## Steps');
    expect(skill).toContain('## Rules Between Steps');
    expect(steps).toContain(
      "Steps 3 to 7 run once per ticket, with a pause for the user's go between tickets, as the Tickets section of `references/workflow-rules.md` describes."
    );
  });

  test('the workflow rules repeat steps 3 to 7 for each ticket in order', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain(
      'repeats steps 3 to 7 for each ticket, in the order of the scope summary'
    );
    expect(tickets).toContain('Build, verify, and review one ticket before starting the next.');
  });

  test('a ticket is marked done in the artifact step, and the task spec with the last ticket', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain(
      'In step 6, update the feature specs first, then mark the ticket done where the tickets are tracked'
    );
    expect(tickets).toContain("is part of the ticket's commit");
    expect(tickets).toContain(
      'With the last ticket, mark the task spec done, as the `metacoding-spec` skill describes.'
    );
  });

  test('each ticket closes on its own and the workflow waits before the next', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain(
      'Close each ticket on its own in step 7: commit it or hand it off, and report what was done.'
    );
    expect(tickets).toContain(
      "After every ticket but the last, wait for the user's go before starting the next one."
    );
  });

  test('the last ticket also gets the whole change reviewed against the task spec', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain(
      'In step 5 of the last ticket, the `metacoding-review` skill also checks the whole change against the task spec.'
    );
  });

  test('a one-ticket task runs the sequence once against the scope summary', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );
    const build = rules.slice(
      rules.indexOf('3. Build test-first.'),
      rules.indexOf('4. Verify.')
    );

    for (const marker of [
      '## Tickets',
      '## Scope Control',
      '3. Build test-first.',
      '4. Verify.',
    ]) {
      expect(rules).toContain(marker);
    }
    expect(tickets).toContain(
      'A one-ticket task runs the sequence once, against the scope summary.'
    );
    expect(tickets).toContain('When it has a task spec, step 6 marks its ticket and the task spec done');
    expect(build).toContain(
      'Start from the scenarios of the ticket being built, or of the scope summary when the task is one ticket.'
    );
  });

  test('grounding looks for a task spec in progress', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const grounding = rules.slice(
      rules.indexOf('1. Ground in the repository.'),
      rules.indexOf('2. Shape the task')
    );

    expect(rules).toContain('1. Ground in the repository.');
    expect(rules).toContain('2. Shape the task');
    expect(grounding).toContain(
      'Look for a task spec whose status is in progress, where `references/repository-organization.md` says task specs go.'
    );
    expect(grounding).toContain(
      'When the request continues that task, resume it as the Tickets section describes.'
    );
  });

  test('an unfinished task resumes from its task spec at the first ticket not done', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const skill = read('metacoding-workflow/SKILL.md');
    const resuming = rules.slice(
      rules.indexOf('### Resuming a task'),
      rules.indexOf('## Scope Control')
    );
    const steps = skill.slice(
      skill.indexOf('## Steps'),
      skill.indexOf('## Rules Between Steps')
    );

    for (const marker of ['## Tickets', '### Resuming a task', '## Scope Control']) {
      expect(rules).toContain(marker);
    }
    expect(skill).toContain('## Steps');
    expect(skill).toContain('## Rules Between Steps');
    expect(rules.indexOf('### Resuming a task')).toBeGreaterThan(rules.indexOf('## Tickets'));
    expect(resuming).toContain('The task spec is the agreed scope. Skip step 2.');
    expect(resuming).toContain(
      'Start at the first ticket that is not marked done where the tickets are tracked, and follow the rules above from there, including the wait before each next ticket.'
    );
    expect(steps).toContain(
      'When the request continues a task that an earlier session left unfinished, the task resumes from its task spec at the first ticket not yet done, as the same section describes.'
    );
  });

  test('the workflow asks which task to resume when it cannot tell', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const resuming = rules.slice(
      rules.indexOf('### Resuming a task'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('### Resuming a task');
    expect(rules).toContain('## Scope Control');
    expect(resuming).toContain(
      'Ask the user which task to work on when more than one task spec is in progress, or when you cannot tell whether the request belongs to the task spec.'
    );
  });

  test('the workflow rules review a ticket as the agreed scope', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const review = rules.slice(
      rules.indexOf('5. Review.'),
      rules.indexOf('6. Update artifacts')
    );

    expect(rules).toContain('5. Review.');
    expect(rules).toContain('6. Update artifacts');
    expect(review).toContain(
      'For a task with more than one ticket, the agreed scope is the ticket, as the skill describes.'
    );
  });

  test('the completion standard requires closed tickets and a task spec marked done', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const completion = rules.slice(rules.indexOf('## Completion Standard'));

    expect(rules).toContain('## Completion Standard');
    expect(completion).toContain(
      'every ticket is closed and, when the task has a task spec, it is marked done'
    );
  });

  test('TDD starts from what the ticket being built must prove', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const before = tdd.slice(
      tdd.indexOf('## Before the first loop'),
      tdd.indexOf('## The loop')
    );

    expect(tdd).toContain('## Before the first loop');
    expect(tdd).toContain('## The loop');
    expect(before).toContain(
      'Start from the scenarios of the ticket you are building, or of the confirmed scope summary when the task is one ticket'
    );
  });

  test('review checks a ticket against what it delivers and the task scope lists', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const what = review.slice(
      review.indexOf('## What to review'),
      review.indexOf('## Who reviews')
    );

    expect(review).toContain('## What to review');
    expect(review).toContain('## Who reviews');
    expect(what).toContain(
      "the scenarios that ticket delivers, read together with the task's in-scope and out-of-scope lists"
    );
  });

  test('review checks the whole change against the task spec with the last ticket', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const finalPass = review.slice(
      review.indexOf('## After the last ticket'),
      review.indexOf('## Report')
    );

    expect(review).toContain('## After the last ticket');
    expect(review).toContain('## Report');
    expect(finalPass).toContain(
      "run the scope axis once more after the ticket's own review and before the task is closed"
    );
    expect(finalPass).toContain("Pin the diff from the commit before the task's first ticket");
    expect(finalPass).toContain(
      "Compare the whole change with the task spec or the scope summary: its goal, its stories or success criteria, and its in-scope and out-of-scope lists."
    );
    expect(finalPass).toContain("Tickets can each pass while the task's goal is still missed.");
  });

  test('the scope summary says the tickets are built and reviewed one at a time', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const summarySection = spec.slice(
      spec.indexOf('## The scope summary'),
      spec.indexOf('## Records written on confirmation')
    );

    expect(spec).toContain('## The scope summary');
    expect(spec).toContain('## Records written on confirmation');
    expect(summarySection).toContain(
      "the tickets are built one at a time, each ticket's scenarios, or its test intent, seed its test-first work, and reviews check each ticket and then the whole change against the summary."
    );
  });

  test('a ticket in the task spec checklist is ticked when it is done', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');

    expect(spec).toContain('## The task spec');
    expect(section).toContain(
      'the checklist in the task spec is the tracker: tick a ticket when it is done.'
    );
  });

  test('a change to a task spec in progress is confirmed and written into the task spec first', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const section = sectionOf(spec, '## The task spec', '## Feature specs');
    const resuming = rules.slice(
      rules.indexOf('### Resuming a task'),
      rules.indexOf('## Scope Control')
    );

    for (const marker of ['### Resuming a task', '## Scope Control']) {
      expect(rules).toContain(marker);
    }
    expect(spec).toContain('## The task spec');
    expect(section).toContain(
      'While the task spec is in progress, a change to what it agreed is a decision for the user. Once they confirm it, write the change into the task spec with its date before building it.'
    );
    expect(resuming).toContain(
      'When the request changes what the task spec agreed, settle the change first, as the `metacoding-spec` skill describes for a task spec in progress.'
    );
  });

  test('the records written on confirmation are committed on their own before the build', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(shaping).toContain(
      "When VCS work is in scope, commit those records on their own before the build starts, so that a ticket's commit holds only that ticket's work. A confirmed change to a task spec in progress is committed the same way."
    );
  });

  test('the Codex prompt for the workflow resumes a task whose task spec is in progress', async () => {
    const { read } = await installFor('codex');
    const prompt = read('metacoding-workflow/agents/openai.yaml');

    expect(prompt).toContain(
      'resume a task with a task spec still in progress or interview me on the open decisions and confirm the scope summary'
    );
  });

  test('the Codex prompt for the workflow builds one ticket at a time and waits', async () => {
    const { read } = await installFor('codex');
    const prompt = read('metacoding-workflow/agents/openai.yaml');

    expect(prompt).toContain('one ticket at a time');
    expect(prompt).toContain('wait for my go before the next');
  });
});

describe('installed skill content: skill refinements', () => {
  test('TDD has a test doubles section that keeps the rule on what to replace', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const section = tdd.slice(
      tdd.indexOf('## Test doubles'),
      tdd.indexOf('## When a behavior cannot be tested first')
    );

    expect(tdd).toContain('## Test doubles');
    expect(tdd).toContain('## When a behavior cannot be tested first');
    expect(tdd).toContain('## What a good test looks like');
    expect(tdd.indexOf('## Test doubles')).toBeGreaterThan(
      tdd.indexOf('## What a good test looks like')
    );
    expect(tdd).toContain(
      'It replaces only what sits outside your control: network, clock, randomness, third-party services.'
    );
    expect(section).toContain('replace only what sits outside your control');
  });

  test('TDD prefers a real or in-memory stand-in over a mock that checks calls', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const section = tdd.slice(
      tdd.indexOf('## Test doubles'),
      tdd.indexOf('## When a behavior cannot be tested first')
    );

    expect(tdd).toContain('## Test doubles');
    expect(tdd).toContain('## When a behavior cannot be tested first');
    expect(section).toContain(
      'Prefer a real or in-memory stand-in to a mock that checks which calls were made'
    );
    expect(section).toContain('Check calls only when the call itself is the behavior');
  });

  test("TDD never replaces the code under test or the codebase's own modules", async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const section = tdd.slice(
      tdd.indexOf('## Test doubles'),
      tdd.indexOf('## When a behavior cannot be tested first')
    );

    expect(tdd).toContain('## Test doubles');
    expect(tdd).toContain('## When a behavior cannot be tested first');
    expect(section).toContain(
      'Never replace the code under test or another module of this codebase.'
    );
  });

  test('TDD shows a good and a bad example of a test double', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const section = tdd.slice(
      tdd.indexOf('## Test doubles'),
      tdd.indexOf('## When a behavior cannot be tested first')
    );

    expect(tdd).toContain('## Test doubles');
    expect(tdd).toContain('## When a behavior cannot be tested first');
    const good = section.slice(section.indexOf('Good:'), section.indexOf('Bad:'));
    const bad = section.slice(section.indexOf('Bad:'));

    expect(section).toContain('Good:');
    expect(section).toContain('Bad:');
    expect(good).toContain(
      'Good: the double is a clock, which is outside your control, and the test checks the result.'
    );
    expect(good).toContain('clock = FixedClock("2026-01-01")');
    expect(good).toContain('assert order.expires_on == "2026-01-08"');
    expect(bad).toContain(
      'Bad: the double replaces a module of this codebase, and the test checks a call.'
    );
    expect(bad).toContain('pricing = mock(pricing_module)');
    expect(bad).toContain('assert pricing.calculate was called once');
  });

  test('debug masks credentials and personal data in what it shows, writes, or commits', async () => {
    const { read } = await installFor('codex');
    const debug = read('metacoding-debug/SKILL.md');
    const reproduce = debug.slice(
      debug.indexOf('## 1. Reproduce with one command'),
      debug.indexOf('## 2. Minimize')
    );

    expect(debug).toContain('## 1. Reproduce with one command');
    expect(debug).toContain('## 2. Minimize');
    expect(reproduce).toContain(
      'credentials (tokens, passwords, keys, cookies) and personal data (names, emails, addresses, account numbers)'
    );
    expect(reproduce).toContain(
      "Mask the secrets in everything you show the user, write into the repo, or commit: the command's input, a fixture, a log excerpt, the regression test."
    );
    expect(reproduce).toContain(
      'Replace each secret with a made-up value of the same shape, then rerun the command to check that the masked version still fails.'
    );
  });

  test('debug keeps the raw capture outside the repo', async () => {
    const { read } = await installFor('codex');
    const debug = read('metacoding-debug/SKILL.md');
    const reproduce = debug.slice(
      debug.indexOf('## 1. Reproduce with one command'),
      debug.indexOf('## 2. Minimize')
    );

    expect(debug).toContain('## 1. Reproduce with one command');
    expect(debug).toContain('## 2. Minimize');
    expect(reproduce).toContain(
      'Keep the raw capture outside the repo, and replay it from there.'
    );
  });

  test('debug never prints a secret in a temporary log line', async () => {
    const { read } = await installFor('codex');
    const debug = read('metacoding-debug/SKILL.md');
    const testing = debug.slice(
      debug.indexOf('## 4. Test one hypothesis at a time'),
      debug.indexOf('## 5. Fix with a regression test')
    );

    expect(debug).toContain('## 4. Test one hypothesis at a time');
    expect(debug).toContain('## 5. Fix with a regression test');
    expect(testing).toContain(
      'Never print a credential or personal data in a log line: removing the line later does not remove what it already wrote.'
    );
  });

  test('debug deletes the raw captures it made when it cleans up', async () => {
    const { read } = await installFor('codex');
    const debug = read('metacoding-debug/SKILL.md');
    const cleanUp = debug.slice(debug.indexOf('## 6. Clean up'));

    expect(debug).toContain('## 6. Clean up');
    expect(cleanUp).toContain(
      '- Raw captures you made are deleted. A file the user supplied stays theirs.'
    );
  });

  test('the standards axis of review checks a fixed list of code smells in the diff', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const standards = review.slice(
      review.indexOf('**Standards.**'),
      review.indexOf('## After the last ticket')
    );

    expect(review).toContain('**Standards.**');
    expect(review).toContain('## After the last ticket');
    const smells = [
      'Logic duplicated that an existing helper already covers.',
      'A function or module that does more than one job.',
      'A name that does not say what the thing is or does.',
      'An error swallowed, or silently replaced by a default.',
      'Dead code: an unused parameter, branch, or export.',
      'A magic value repeated instead of named once.',
      'Input taken at a boundary (user, file, network) without a check.',
      'A test that asserts how the code works instead of what it does.',
    ];

    expect(standards).toContain('Code smells, looked for in the diff:');
    for (const smell of smells) {
      expect(standards).toContain(`- ${smell}\n`);
    }
  });

  test("review lets the repo's own standards win over the smell list", async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const standards = review.slice(
      review.indexOf('**Standards.**'),
      review.indexOf('## After the last ticket')
    );

    expect(review).toContain('**Standards.**');
    expect(review).toContain('## After the last ticket');
    expect(standards).toContain(
      "A code smell from the list below, where the repo's documented rules and neighboring code say nothing. Where they say something, they win."
    );
  });

  test('a smell that breaks the agreed scope is handled as a scope finding', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const standards = review.slice(
      review.indexOf('**Standards.**'),
      review.indexOf('## After the last ticket')
    );

    expect(review).toContain('**Standards.**');
    expect(review).toContain('## After the last ticket');
    expect(standards).toContain(
      'A smell that also breaks the agreed scope is a scope finding, and is handled as one.'
    );
  });

  test('the standards reviewer receives the smell list', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const who = review.slice(
      review.indexOf('## Who reviews'),
      review.indexOf('## The two axes')
    );

    expect(review).toContain('## Who reviews');
    expect(review).toContain('## The two axes');
    expect(who).toContain(
      "The list of code smells below is one of the standards axis's inputs."
    );
  });

  test('review marks smells in its report', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const report = review.slice(
      review.indexOf('## Report'),
      review.indexOf('## After the report')
    );

    expect(review).toContain('## Report');
    expect(review).toContain('## After the report');
    expect(report).toContain('Mark a finding from the smell list as a smell.');
  });

  test('review puts smells to the user as follow-ups and fixes them only when asked', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const after = review.slice(review.indexOf('## After the report'));

    expect(review).toContain('## After the report');
    expect(after).toContain(
      '- Put each smell, and anything else, to the user as a follow-up. A follow-up is fixed only when the user asks.'
    );
  });

  test('the workflow no longer refuses to switch tasks', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const scopeControl = rules.slice(
      rules.indexOf('## Scope Control'),
      rules.indexOf('## Repeated Tasks')
    );

    expect(rules).toContain('## Scope Control');
    expect(rules).toContain('## Repeated Tasks');
    expect(rules).not.toContain('Reject task switching');
    expect(scopeControl).toContain(
      'When the user asks for something unrelated during a task, say what is unfinished in the active ticket, then do what they decide: queue the request for later, or pause the task and switch.'
    );
  });

  test('a queued request is recorded so it is not lost', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const scopeControl = rules.slice(
      rules.indexOf('## Scope Control'),
      rules.indexOf('## Repeated Tasks')
    );

    expect(rules).toContain('## Scope Control');
    expect(rules).toContain('## Repeated Tasks');
    expect(scopeControl).toContain(
      'Record a queued request where the repo tracks work. Where it tracks work nowhere, name it in the report that closes the ticket.'
    );
  });

  test('a task pauses at a ticket boundary', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const scopeControl = rules.slice(
      rules.indexOf('## Scope Control'),
      rules.indexOf('## Repeated Tasks')
    );

    expect(rules).toContain('## Scope Control');
    expect(rules).toContain('## Repeated Tasks');
    expect(scopeControl).toContain(
      'Pause at a ticket boundary: finish the active ticket first. In a one-ticket task, that is the whole task.'
    );
  });

  test('a switch at once sets the unfinished work aside and notes what is left', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const scopeControl = rules.slice(
      rules.indexOf('## Scope Control'),
      rules.indexOf('## Repeated Tasks')
    );

    expect(rules).toContain('## Scope Control');
    expect(rules).toContain('## Repeated Tasks');
    expect(scopeControl).toContain(
      "When the user wants the switch at once, set the unfinished work aside so it stays out of the new task's changes, such as on a branch or in a stash."
    );
    expect(scopeControl).toContain(
      'Note what is done and what is left where the tickets are tracked, and leave the ticket not marked done.'
    );
  });

  test('a paused task continues by the resume rule', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const scopeControl = rules.slice(
      rules.indexOf('## Scope Control'),
      rules.indexOf('## Repeated Tasks')
    );

    expect(rules).toContain('## Scope Control');
    expect(rules).toContain('## Repeated Tasks');
    expect(rules).toContain('### Resuming a task');
    expect(scopeControl).toContain(
      'A paused task with a task spec continues as the Resuming a task section describes.'
    );
  });

  test('the workflow skill leaves queue or pause to the user', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const between = skill.slice(
      skill.indexOf('## Rules Between Steps'),
      skill.indexOf('## Bundled Templates')
    );

    expect(skill).toContain('## Rules Between Steps');
    expect(skill).toContain('## Bundled Templates');
    expect(between).toContain(
      'An unrelated request is queued, or the task is paused, as the user decides and as Scope Control in `references/workflow-rules.md` describes'
    );
  });
});

describe('installed skill content: prompt upkeep', () => {
  test('the workflow skill lists the steps as an index and leaves what they require to the workflow rules', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const steps = skill.slice(
      skill.indexOf('## Steps'),
      skill.indexOf('## Rules Between Steps')
    );

    expect(skill).toContain('## Steps');
    expect(skill).toContain('## Rules Between Steps');
    expect(rules).toContain('## Operating Sequence');
    expect(steps).toContain(
      [
        'The steps, in order. What each one requires is in the Operating Sequence of `references/workflow-rules.md`.',
        '',
        '1. Ground in the repo.',
        '2. Shape, with `metacoding-shape` and `metacoding-spec`.',
        '3. Build test-first, with `metacoding-tdd` or `metacoding-debug`.',
        '4. Verify.',
        '5. Review, with `metacoding-review`.',
        '6. Update artifacts.',
        '7. Close.',
        '',
      ].join('\n')
    );
    for (const detail of [
      'Look up facts yourself',
      'and any task spec still in progress',
      'Changing files starts only after',
      'the skill then writes the settled terms',
      'a failing test before each piece of production code',
      'a bug whose cause is unknown',
      'it ends in a regression test and a fix',
      'Run the smallest relevant checks first',
      'Confirm the behavior a user would observe',
      'act on what it finds',
      'Update the one document that owns each concept',
      'amend any decision record the build proved wrong',
      'commit-ready handoff',
    ]) {
      expect(steps).not.toContain(detail);
    }
  });

  test('the workflow rules keep what the old step summaries said about artifacts and closing', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const artifacts = rules.slice(
      rules.indexOf('6. Update artifacts'),
      rules.indexOf('7. Close the loop.')
    );
    const closing = rules.slice(
      rules.indexOf('7. Close the loop.'),
      rules.indexOf('## Tickets')
    );

    for (const marker of ['6. Update artifacts', '7. Close the loop.', '## Tickets']) {
      expect(rules).toContain(marker);
    }
    expect(artifacts).toContain(
      'Update the one artifact that owns the concept instead of duplicating the same information, as `references/repository-organization.md` describes.'
    );
    expect(closing).toContain('Either way, state explicitly that the work is complete.');
  });

  test('every skill has frontmatter that parses, with its name and a description, for every vendor', async () => {
    for (const vendor of Object.keys(skillsDirs) as AgentVendor[]) {
      const { read } = await installFor(vendor);

      for (const skill of METACODING_SKILLS) {
        const frontmatter = frontmatterOf(read(`${skill}/SKILL.md`));

        expect(frontmatter.name).toBe(skill);
        expect(typeof frontmatter.description).toBe('string');
        expect(frontmatter.description).not.toBe('');
      }
    }
  });

  test('the workflow skill applies only when the request asks for it or for gated execution', async () => {
    const { read } = await installFor('codex');
    const { description } = frontmatterOf(read('metacoding-workflow/SKILL.md'));

    expect(description).toContain(
      'Use only when the request asks for the metacoding workflow, or for strict, gated execution of a task.'
    );
    for (const broadTrigger of ['feature work', 'bug fixes', 'refactors', 'reviews']) {
      expect(description).not.toContain(broadTrigger);
    }
  });
});

describe('installed skill content: onboarding', () => {
  test('onboarding ends in a project map that saves later sessions the search', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const intro = sectionOf(onboard, '# Onboard', '## The project map');

    expect(intro).toContain('Run this once per repo, and again when one of the places moves.');
    expect(intro).toContain('so that no later session has to work the places out again');
    expect(intro).toContain(
      'The metacoding workflow and the `metacoding-shape` and `metacoding-spec` skills read that file.'
    );
  });

  test('the project map is one committed file at the same path in every repo', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## The project map', '## 1. Look');

    expect(section).toContain(
      'The project map is the file `.metacoding/project.md`, at the same path in every repo.'
    );
    expect(section).toContain('It is committed with the repo');
  });

  test('the project map holds four labelled lines with paths from the repo root', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## The project map', '## 1. Look');

    expect(section).toContain('# Project map\n');
    expect(section).toContain(
      '- Tracker: <GitHub issues, a file path, or none: the checklist in each task spec>\n' +
        '- Specs: <folder>\n' +
        '- Glossary: <file>\n' +
        '- Decision records: <file or folder>\n'
    );
    expect(section).toContain(
      'Keep the four labels as they are, so that a reader finds a place by its label.'
    );
    expect(section).toContain('Write each path from the repo root, starting with `/`.');
    expect(section).toContain(
      'Written by the `metacoding-onboard` skill; run it again to change a line.'
    );
  });

  test('the tracker line says where the repo tracks work, for tickets and queued requests alike', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const format = sectionOf(onboard, '## The project map', '## 1. Look');
    const ask = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(format).toContain(
      'The tracker line says where the repo tracks work: the tickets of a task spec go there, and so does a request queued for later.'
    );
    expect(format).toContain(
      'A line that says none means the repo tracks work nowhere, and the tickets are a checklist in each task spec.'
    );
    expect(ask).toContain('Say in the tracker question what the answer decides.');
  });

  test('onboarding is asked for by the user, not started by the workflow', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const frontMatter = sectionOf(onboard, '---', '# Onboard');

    expect(frontMatter).toContain('when the user asks to onboard the repo');
    expect(frontMatter).not.toContain('workflow reports');
  });

  test('onboarding looks at what the repo has before it asks', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 1. Look', '## 2. Ask');

    expect(section).toContain('Find out what the repo already has before asking anything.');
    for (const place of ['Tracker:', 'Specs:', 'Glossary:', 'Decision records:']) {
      expect(section).toContain(`- ${place}`);
    }
    expect(section).toContain(
      '- Instruction file: the file your agent loads at the start of every session, such as `CLAUDE.md` or `AGENTS.md`'
    );
  });

  test('onboarding notes when a place was last changed', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 1. Look', '## 2. Ask');

    expect(section).toContain(
      'For each place, note whether you found it and when it last changed.'
    );
    expect(section).toContain('may no longer be in use');
  });

  test('onboarding asks one round of numbered questions with a recommended place each', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(section).toContain(
      'Put the places to the user in one round of numbered questions, each with a recommended place and a one-line reason.'
    );
    expect(section).toContain('Recommend what you found.');
  });

  test('the question format stays with the shape skill', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(section).toContain('Use the question format of the `metacoding-shape` skill');
    expect(onboard).not.toContain('Recommended: <');
  });

  test('two competing candidates for a place go to the user with a recommendation', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(section).toContain(
      "name both and recommend one: which of them is kept current is the user's decision"
    );
  });

  test('onboarding recommends the defaults of the spec skill for what the repo lacks', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(section).toContain(
      'For a place the repo does not have, recommend the default: the place the `metacoding-spec` skill uses in a repo that has none.'
    );
    expect(section).toContain('`../metacoding-spec/SKILL.md`');
    expect(section).toContain(
      'In an empty folder all four recommendations are the defaults, and the user can confirm the round in one line.'
    );
    // The default places have their home in the shape skill.
    expect(onboard).not.toContain('/_meta/');
  });

  test('onboarding offers a one-line pointer in the instruction file the agent loads', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '### The pointer', '## 3. Write');

    expect(section).toContain(
      'one line in the instruction file your agent loads at the start of every session'
    );
    expect(section).toContain(
      "This repo's tracker, specs, glossary, and decision records are listed in `.metacoding/project.md`."
    );
    expect(section).toContain(
      'Offer it as the last question of the round, after the four places.'
    );
    expect(section).toContain(
      'The line gives the path and nothing else: the places themselves stay in the project map alone.'
    );
  });

  test('a repo with no instruction file gets no pointer and no new file', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '### The pointer', '## 3. Write');

    expect(section).toContain(
      'When the repo has no such file, say so instead of asking, and create none.'
    );
  });

  test('a pointer that is already there is left alone', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '### The pointer', '## 3. Write');

    expect(section).toContain(
      'When the file already has the line, leave it as it is and skip the question.'
    );
  });

  test('onboarding writes the project map only after the user confirms', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 3. Write', '## 4. Get the user started');

    expect(section).toContain(
      'Write the project map only after the user has confirmed the round. Nothing is written before that.'
    );
  });

  test('onboarding records the places and creates none of them', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 3. Write', '## 4. Get the user started');

    expect(section).toContain('Record the places and create none of them.');
    expect(section).toContain(
      'is created by the `metacoding-spec` skill when a task first needs it, at the path recorded here'
    );
  });

  test('the pointer is added only on a yes, to a file the repo already has', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 3. Write', '## 4. Get the user started');

    expect(section).toContain(
      'Add the pointer only when the user said yes to it, and only to a file the repo already has.'
    );
  });

  test('the project map is committed, or the user is told it is waiting', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 3. Write', '## 4. Get the user started');

    expect(section).toContain(
      'Commit it when the user has you make commits; otherwise tell them the file is waiting to be committed.'
    );
  });

  test('run again, onboarding shows the current project map and asks what changed', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## Running it again');

    expect(section).toContain('When the repo already has a project map, read it first');
    expect(section).toContain('Show the user the current project map');
    expect(section).toContain('ask what changed');
    expect(section).toContain(
      'Rewrite the file only after they confirm, and change only the lines they changed.'
    );
  });

  test('run again, a recorded place that is missing is named but is not an error', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## Running it again');

    expect(section).toContain('name each line whose place you could not find');
    expect(section).toContain('A place that is recorded but not created yet is not an error.');
  });

  test('run again, onboarding offers the pointer when the instruction file lacks it', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## Running it again');

    expect(section).toContain('Offer the pointer again when the instruction file lacks it.');
  });

  test('the workflow points to onboarding when the repo has no project map', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const grounding = sectionOf(rules, '1. Ground in the repository.', '2. Shape the task');

    expect(grounding).toContain(
      'When the repo has no project map, tell the user in one line that the `metacoding-onboard` skill can record where the repo keeps its tracker, specs, glossary, and decision records, then carry on with the task.'
    );
  });

  test('the workflow skill names onboarding as run once per repo', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const intro = sectionOf(skill, '# Metacoding Workflow', '## Start Here');

    expect(intro).toContain(
      'One more skill, `metacoding-onboard`, is run once per repo instead of once per task'
    );
    expect(intro).toContain('the project map, `.metacoding/project.md`');
  });

  test('the Codex prompt for onboarding asks one round and writes on confirmation', async () => {
    const { read } = await installFor('codex');
    const prompt = read('metacoding-onboard/agents/openai.yaml');

    expect(prompt).toContain('$metacoding-onboard');
    expect(prompt).toContain('one round of numbered questions with a recommended place for each');
    expect(prompt).toContain('write the project map once I confirm');
  });
});

describe('installed skill content: using the project map', () => {
  test('grounding reads the project map before the glossary and the decision records', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const grounding = sectionOf(rules, '1. Ground in the repository.', '2. Shape the task');
    const readsMap =
      'Read the project map, `.metacoding/project.md`, when the repo has one, and use the places it names, as `references/repository-organization.md` describes.';

    expect(grounding).toContain(readsMap);
    expect(grounding).toContain('Read the glossary and the decision records');
    expect(grounding.indexOf(readsMap)).toBeLessThan(
      grounding.indexOf('Read the glossary and the decision records')
    );
  });

  test('the layout reference says what the project map is and who writes it', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = sectionOf(layout, '## Project Map', '## Specs, Tickets, and Test Records');

    expect(layout).toContain('## MECE Documentation Architecture');
    expect(layout.indexOf('## MECE Documentation Architecture')).toBeLessThan(
      layout.indexOf('## Project Map')
    );
    expect(section).toContain('`.metacoding/project.md` is the project map');
    expect(section).toContain('The `metacoding-onboard` skill writes it and holds its format.');
  });

  test('a place the project map names is used, and created there when it is missing', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = sectionOf(layout, '## Project Map', '## Specs, Tickets, and Test Records');

    expect(section).toContain(
      'Where the project map names a place, use that place, and create it there when it does not exist yet.'
    );
  });

  test('the tracker line says where the repo tracks work, and none means nowhere', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = sectionOf(layout, '## Project Map', '## Specs, Tickets, and Test Records');

    expect(section).toContain('The tracker line says where this repo tracks work.');
    expect(section).toContain(
      'A line that says none is an answer too: the repo tracks work nowhere, and the tickets are a checklist in the task spec.'
    );
  });

  test("the layout reference's own places apply only where the project map is silent", async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = sectionOf(layout, '## Project Map', '## Specs, Tickets, and Test Records');

    expect(section).toContain(
      "The places this reference names for those four records, and its rules for a repo's own place, apply only to a place the project map has no line for, and to a repo with no project map."
    );
  });

  test('the adaptation fallbacks come after the project map', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const intro = sectionOf(adaptation, '# Platform Adaptation', '## Missing Task Tracking');

    expect(intro).toContain(
      'These fallbacks come after the project map, `.metacoding/project.md`: where it names a tracker, a glossary, or a place for specs or decision records, that answer stands, as `references/repository-organization.md` describes.'
    );
  });

  test('shape reads the project map before the first round', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = sectionOf(shape, '## The project map', '## Terms');

    expect(section).toContain(
      'When the repo has a project map, `.metacoding/project.md`, read it before the first round.'
    );
    expect(section).toContain('The `metacoding-onboard` skill writes it');
    expect(section).toContain('Read the glossary at the place it names.');
  });

  test('the spec skill reads and writes its records where the project map says', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The project map', '## Solution and tickets');

    expect(section).toContain(
      'When the repo has a project map, `.metacoding/project.md`, read it before writing the scope summary.'
    );

    expect(section).toContain(
      'Where the project map names a place, use that place wherever this skill reads or writes the glossary, a decision record, a task spec, or a ticket, and create it there when it does not exist yet.'
    );
  });

  test('the spec skill falls back to its defaults for a missing line or a missing project map', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The project map', '## Solution and tickets');

    expect(section).toContain(
      "The default places and the rules for a repo's own place, below, apply only to a place the project map has no line for, and to a repo with no project map."
    );
  });

  test('the spec skill on its own treats a tracker line that says none as an answer', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = sectionOf(spec, '## The project map', '## Solution and tickets');

    expect(section).toContain('The tracker line says where this repo tracks work.');
    expect(section).toContain(
      'A line that says none is an answer too: the repo tracks work nowhere, and the checklist in the task spec is the tracker.'
    );
  });
});

describe('installed skill content: getting started', () => {
  test('the onboard skill closes by telling the user how to work from here', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 4. Get the user started', '## Running it again');

    expect(section).toContain(
      'Close by telling the user how to work from here, in a few lines:'
    );
    expect(section).toContain(
      '- What you wrote: the project map with its four lines, and the pointer when you added it.'
    );
    expect(section).toContain(
      '- How to start a task: ask for the `metacoding-workflow` skill.'
    );
    expect(section).toContain(
      '- What each metacoding skill is for, one line each, this one left out.'
    );
  });

  test("the closing lines take each skill's purpose from its own description", async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 4. Get the user started', '## Running it again');

    expect(section).toContain(
      "Take each skill's name and purpose from the description at the top of its `SKILL.md`, in the `metacoding-*` folders installed next to this skill's folder."
    );
    expect(section).toContain(
      'Keep no list of your own, so that a skill added later is not left out.'
    );
    // No purpose is restated here, and no skill is named but the one that starts a task.
    expect(section).not.toContain('request to handoff');
    for (const skill of METACODING_SKILLS.filter((name) => name !== WORKFLOW_SKILL)) {
      expect(section).not.toContain(skill);
    }
  });

  test('a later run closes the same way, with what changed', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## Running it again');

    expect(section).toContain(
      'Close as step 4 describes, with what changed in place of what you wrote.'
    );
    expect(onboard).not.toContain('first run');
  });

  test('the Codex prompt for onboarding ends with how to start a task', async () => {
    const { read } = await installFor('codex');
    const prompt = read('metacoding-onboard/agents/openai.yaml');

    expect(prompt).toContain('then tell me how to start a task');
  });
});

describe('installed skill content: the design skill', () => {
  const designSection = async (from: string, to: string) => {
    const { read } = await installFor('codex');
    const design = read('metacoding-design/SKILL.md');

    expect(design).toContain(from);
    expect(design).toContain(to);
    expect(design.indexOf(to)).toBeGreaterThan(design.indexOf(from));
    return design.slice(design.indexOf(from), design.indexOf(to));
  };

  test('the design skill has Codex metadata with a name and a prompt', async () => {
    const { read } = await installFor('codex');
    const metadata = read('metacoding-design/agents/openai.yaml');

    expect(metadata).toContain('display_name: "Metacoding Design"');
    expect(metadata).toContain(
      'short_description: "Design code by module depth, interfaces, and seams"'
    );
    expect(metadata).toContain('default_prompt: "Use $metacoding-design to ');
  });

  test('design defines its four terms with the words to avoid', async () => {
    const terms = await designSection('## Terms', '## Rules');

    expect(terms).toContain(
      '**Module**: anything with an interface and code behind it, such as a function, a class, a package, or a service. Avoid: component, unit.'
    );
    expect(terms).toContain(
      '**Interface**: everything a caller must know to use a module: names and types, the order of calls, errors, config. Avoid: API, signature.'
    );
    expect(terms).toContain(
      '**Depth**: how much behavior sits behind the interface, compared with how much a caller must know. A module is deep or shallow. Avoid: size.'
    );
    expect(terms).toContain(
      '**Seam**: a place where what sits behind an interface can be swapped without editing its callers. A test puts a stand-in there. Avoid: boundary, layer.'
    );
  });

  test('design prefers a deep module and shows a deep and a shallow one', async () => {
    const rule = await designSection(
      '### 1. Prefer a deep module',
      '### 2. Keep the whole interface small'
    );

    expect(rule).toContain('A deep module puts a lot of behavior behind a small interface.');
    expect(rule).toContain(
      "A shallow module's caller must know nearly as much as it would take to write the code behind it; a module that only passes calls on is the plainest case."
    );
    expect(rule).toContain(
      'Depth is judged at the interface: a deep module can be built from small parts inside, as long as callers do not see them.'
    );
    expect(rule).toContain(
      'Good: one call. The caller knows nothing about discounts, tax, or rounding.'
    );
    expect(rule).toContain('total = price_of(cart)');
    expect(rule).toContain(
      'Bad: the caller must know every step and the order they go in. The module hides nothing.'
    );
    expect(rule).toContain('tax = pricing.tax_on(subtotal - discount)');
    expect(rule.indexOf('Bad: ')).toBeGreaterThan(rule.indexOf('Good: '));
  });

  test('design counts everything a caller must know as the interface', async () => {
    const rule = await designSection(
      '### 2. Keep the whole interface small',
      '### 3. Apply the deletion test'
    );

    expect(rule).toContain(
      'Judge an interface by everything in it, not only by its names and types.'
    );
    expect(rule).toContain(
      'A required order of calls, an error the caller must handle, a config value that must be set first: a caller must know each of these.'
    );
    expect(rule).toContain(
      'Count all of it when you judge how small the interface is, and move what you can behind it.'
    );
  });

  test('design applies the deletion test to a module in doubt', async () => {
    const rule = await designSection(
      '### 3. Apply the deletion test',
      '### 4. Put a seam only where something varies'
    );

    expect(rule).toContain('When you doubt that a module earns its place, imagine it gone.');
    expect(rule).toContain('If its complexity reappears in every caller, it earns its place.');
    expect(rule).toContain(
      'If nothing gets harder, it does not: merge it into its caller or into the module it passes calls to.'
    );
  });

  test('design puts a seam only where something varies, with a good and a bad one', async () => {
    const rule = await designSection(
      '### 4. Put a seam only where something varies',
      '### 5. Test through the interface'
    );

    expect(rule).toContain(
      'Put a seam where something really varies or sits outside your control: network, clock, randomness, third-party services.'
    );
    expect(rule).toContain('Add none for a single implementation that nothing replaces.');
    expect(rule).toContain(
      'A seam is real when two things do sit behind it, such as the real service and the stand-in a test uses.'
    );
    expect(rule).toContain(
      'Good: the payment provider is outside your control, so it sits behind a seam, and a test puts a stand-in there.'
    );
    expect(rule).toContain('receipt = checkout(cart, payments)');
    expect(rule).toContain(
      'Bad: a seam with one implementation that nothing replaces. A reader follows one more hop and gains nothing.'
    );
    expect(rule).toContain('class DefaultReportFormatter is a ReportFormatter');
    expect(rule.indexOf('Bad: ')).toBeGreaterThan(rule.indexOf('Good: '));
  });

  test('design tests through the interface and reads the wish to test past it as a sign', async () => {
    const rule = await designSection(
      '### 5. Test through the interface',
      '### 6. Pass dependencies in, and return results'
    );

    expect(rule).toContain(
      'A test that goes through the interface keeps passing when the code behind it is rewritten.'
    );
    expect(rule).toContain('Callers and tests meet a module at its interface.');
    expect(rule).toContain(
      'When you want to test past the interface, at a private step or an inner helper, the module has the wrong shape: either that step deserves an interface of its own, or the interface does not return enough for a test to check the behavior.'
    );
  });

  test('design passes dependencies in and returns results, with a good and a bad example', async () => {
    const rule = await designSection(
      '### 6. Pass dependencies in, and return results',
      '### 7. Design a lasting interface more than once'
    );

    expect(rule).toContain(
      'When a dependency sits behind a seam, the module that uses it must be handed it.'
    );
    expect(rule).toContain('Take the dependency as an argument.');
    expect(rule).toContain(
      'Return the result to the caller instead of changing something out of sight'
    );
    expect(rule).toContain('Good: the clock comes in, and the date comes back.');
    expect(rule).toContain('expires_on = expiry_date(order, clock)');
    expect(rule).toContain(
      'Bad: the clock is created inside, and the result is written where the caller cannot see it.'
    );
    expect(rule).toContain('now = SystemClock().now()');
    expect(rule.indexOf('Bad: ')).toBeGreaterThan(rule.indexOf('Good: '));
  });

  test('design sketches a lasting interface more than once and puts the choice to the user', async () => {
    const rule = await designSection(
      '### 7. Design a lasting interface more than once',
      '## On its own'
    );

    expect(rule).toContain('sketch two or three different interfaces before choosing');
    expect(rule).not.toContain('API');
    expect(rule).toContain(
      'When the host agent supports subagents, you may give each one to its own subagent.'
    );
    expect(rule).toContain(
      'Put the choice to the user with your recommendation and what each one costs.'
    );
  });

  test('the workflow skill lists the design skill and leaves when to use it to the workflow rules', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const steps = skill.slice(
      skill.indexOf('## Steps'),
      skill.indexOf('## Rules Between Steps')
    );

    expect(skill).toContain('## Steps');
    expect(skill).toContain('## Rules Between Steps');
    expect(skill).toContain(
      'Companion skills own the method of single steps, of one part of a step, or of the retro that follows the last ticket, and each also works on its own:'
    );
    expect(skill).toContain(
      '| `metacoding-design` | Decides the shape of code: module depth, interfaces, and seams |'
    );
    expect(steps).not.toContain('metacoding-design');
  });

  test('the workflow rules name the design skill in the shape and build steps', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shapeStep = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );
    const buildStep = rules.slice(
      rules.indexOf('3. Build test-first.'),
      rules.indexOf('4. Verify.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(rules).toContain('4. Verify.');
    expect(shapeStep).toContain(
      'When the solution adds a module or changes an interface, design that part with the `metacoding-design` skill before the scope summary is sent.'
    );
    expect(buildStep).toContain(
      'Use the `metacoding-design` skill when the interface to test through is unclear or does not exist yet, and when restructuring once the behaviors are green.'
    );
  });
});

describe('installed skill content: the design skill on its own', () => {
  const onItsOwn = async () => {
    const { read } = await installFor('codex');
    const design = read('metacoding-design/SKILL.md');

    expect(design).toContain('## On its own');
    return design.slice(design.indexOf('## On its own'));
  };

  test('design says it also judges code that exists', async () => {
    const { read } = await installFor('codex');
    const design = read('metacoding-design/SKILL.md');
    const intro = design.slice(design.indexOf('# Design'), design.indexOf('## Terms'));

    expect(design).toContain('# Design');
    expect(design).toContain('## Terms');
    expect(intro).toContain(
      'Use this skill to decide the shape of code before it is written, and to assess the shape of code that exists.'
    );
    expect(design).toMatch(/^description: .*or to assess the shape of existing code/m);
  });

  test('alone, design works on what the user names and asks when they name nothing', async () => {
    const section = await onItsOwn();

    expect(section).toContain(
      'When the user asks for this skill directly, and not as a step of a task already under way, work on the module or area they name. When they name none, ask which one.'
    );
  });

  test('alone, design proposes an interface and its seams for new code', async () => {
    const section = await onItsOwn();

    expect(section).toContain(
      '**New code.** Propose the interface: everything a caller must know.'
    );
    expect(section).toContain(
      'Say where a seam is needed, if anywhere, and what sits behind it.'
    );
  });

  test('alone, design lists numbered candidates for existing code and names the first', async () => {
    const section = await onItsOwn();

    expect(section).toContain(
      '**Existing code.** Read the code and its tests, then list the candidates for change, numbered.'
    );
    expect(section).toContain('When there is none, say so.');
    expect(section).toContain('- what is wrong, in the terms above');
    expect(section).toContain('- the proposed change');
    expect(section).toContain('- what happens to the tests');
    expect(section).toContain('Say which candidate you would do first, and why.');
  });

  test('alone, design moves the tests to the new interface instead of keeping both', async () => {
    const section = await onItsOwn();

    expect(section).toContain(
      'which tests would be written at the new interface, and which old tests would be deleted'
    );
    expect(section).toContain(
      'Old tests of the parts a change replaces are not kept beside the new ones.'
    );
  });

  test('alone, design changes no file and a picked candidate becomes a task', async () => {
    const section = await onItsOwn();

    expect(section).toContain('Change no file: the result is a proposal.');
    expect(section).toContain(
      'A proposal the user accepts, or a candidate they pick, becomes a task of its own. Agree its scope with the user before any file changes.'
    );
  });

  test('the Codex prompt of design asks for a proposal and no file change', async () => {
    const { read } = await installFor('codex');
    const metadata = read('metacoding-design/agents/openai.yaml');

    expect(metadata).toContain(
      'default_prompt: "Use $metacoding-design to design the module I name, or to assess the code I point at, by module depth, interfaces, and seams, and bring me a proposal without changing any file."'
    );
  });
});

describe('installed skill content: design smells in the review', () => {
  test('the smell list of review has the two design smells, and nothing else handles them', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const list = review.slice(
      review.indexOf('Code smells, looked for in the diff:'),
      review.indexOf('A smell that also breaks the agreed scope')
    );
    const smells = [
      'A function or module that only passes calls on, where its callers could call the target directly and nothing would get harder.',
      'An interface or abstract type with one implementation, which nothing swaps for another, not even a test.',
    ];

    expect(review).toContain('Code smells, looked for in the diff:');
    expect(review).toContain('A smell that also breaks the agreed scope');
    for (const smell of smells) {
      expect(list).toContain(`- ${smell}\n`);
      // Stated once, in the list: the follow-up rule for every smell covers it.
      expect(review.indexOf(smell)).toBe(review.lastIndexOf(smell));
    }
  });
});

describe('installed skill content: the retro', () => {
  const expectInOrder = (content: string, markers: string[]) => {
    const positions = markers.map((marker) => content.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  };

  test('the retro changes no file until the user has answered its proposals', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const intro = sectionOf(retro, '# Retro', '## What to read');

    expect(intro).toContain('It ends in a list of proposals for the user.');
    expect(intro).toContain('It changes no file until the user has answered them.');
    expect(intro).toContain('Run it earlier when the user asks.');
  });

  test('the retro collects the mistakes from what is on record', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## What to read', '## The bar');

    expect(section).toContain('- Review findings that had to be fixed.');
    expect(section).toContain('- Corrections from the user:');
    expect(section).toContain('- Changes to the agreed scope made during the build');
    expect(section).toContain('- Decision records amended because the build proved them wrong.');
    expect(section).toContain('- Checks that failed for a reason that could have been foreseen');
    expect(section).toContain(
      "When the conversation that did the work is gone, read the task spec and the task's commits, then ask the user what went wrong."
    );
    expect(section).toContain(
      'A retro is about mistakes. How fast the work went and what it cost to run are not its subject.'
    );
  });

  test('a mistake becomes a lesson only when it passes a three-part bar', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## The bar', '## From cause to change');

    expect(section).toContain('A mistake becomes a lesson only when all three are true:');
    expectInOrder(section, [
      '1. **It cost something.**',
      '2. **It would happen again.**',
      '3. **A change would stop it.**',
    ]);
    expect(section).toContain(
      'When no mistake passes the bar, say "Nothing worth keeping" in one line and stop.'
    );
  });

  test('the retro names the cause and prefers a check to a rule', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## From cause to change', '## Where a rule goes');

    expect(section).toContain('first say why nothing stopped the mistake');
    expect(section).toContain('Then propose one change, the first in this list that fits:');
    expectInOrder(section, [
      '1. **An automated check**',
      '2. **A fix to an existing rule or doc**',
      '3. **A new rule**',
      '4. **A glossary term or a decision record**',
      '5. **A step in a checklist**',
    ]);
    expect(section).toContain(
      'A check comes first because it cannot be forgotten, and a rule can.'
    );
    expect(section).toContain(
      'A fix comes before a new rule because each fact should have one home.'
    );
  });

  test('a rule goes where the repo keeps its standards, or to /_meta/coding-standards.md', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## Where a rule goes', '## Installed metacoding skills');

    expect(section).toContain(
      'Find where the repo already keeps its standards: a contributor or style doc, a coding standards file, or an agent instruction file.'
    );
    expect(section).toContain(
      'When the repo has no such file, propose creating `/_meta/coding-standards.md`, and create it with the first rule the user approves.'
    );
  });

  test('the retro uses the places the project map names', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## Where a rule goes', '## Installed metacoding skills');

    expect(section).toContain(
      'When the repo has a project map, `.metacoding/project.md`, use the places it names for the glossary, the decision records, and the tracker.'
    );
  });

  test('the retro never edits an installed metacoding skill', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## Installed metacoding skills', '## The proposals');

    expect(section).toContain(
      "Never edit an installed metacoding skill: a folder named `metacoding-*` inside an agent's skills folder, such as `.claude/skills/`."
    );
    expect(section).toContain('propose a rule in the repo\'s standards');
    expect(section).toContain('draft a short issue for the metacoding project');
    expect(section).toContain('This holds even when the repo commits those folders.');
    expect(section).toContain(
      'Any other skill that the repo tracks in git, such as its own skills or the source of a skill package, is edited like any other file.'
    );
  });

  test('the lessons go to the user as one numbered list with a recommendation each', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = sectionOf(retro, '## The proposals', '## After the answer');

    expect(section).toContain(
      'Send the lessons as one numbered list, the most costly mistake first.'
    );
    expect(section).toContain('A "yes" to a lesson accepts your recommendation for it.');
    expectInOrder(section, [
      'L1. <short title>',
      'What happened:',
      'Why nothing stopped it:',
      'Change:',
      'Where:',
      'Recommended: do | skip, because <one-line reason>',
    ]);
    expect(section).toContain(
      'When you cannot reach the user directly, for example when running as a subagent, return the list as your result and stop there. Continue when the answers are sent back.'
    );
  });

  test('approved lessons are applied by size, and a check is seen failing first', async () => {
    const { read } = await installFor('codex');
    const retro = read('metacoding-retro/SKILL.md');
    const section = retro.slice(retro.indexOf('## After the answer'));

    expect(retro).toContain('## After the answer');
    expect(section).toContain("Apply only the lessons the user's answer says to do.");
    expect(section).toContain(
      "When commits are in scope, commit each lesson you applied on its own, apart from the task's commits"
    );
    expect(section).toContain('Watch it fail on the original mistake');
    expect(section).toContain(
      'Queue it as its own task where the repo tracks work. Where it tracks work nowhere, name it in your report.'
    );
    expect(section).toContain(
      'Keep no log of the retro: the changes, with their commit messages where there are commits, are the record.'
    );
  });

  test('Codex gets a display name and a default prompt for the retro', async () => {
    const { read } = await installFor('codex');
    const metadata = YAML.parse(read('metacoding-retro/agents/openai.yaml'));

    expect(metadata.interface.display_name).toBe('Metacoding Retro');
    expect(metadata.interface.default_prompt).toContain('Use $metacoding-retro to');
  });

  test('the workflow skill lists the retro among its companions', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const intro = sectionOf(skill, '# Metacoding Workflow', '## Start Here');

    expect(intro).toContain(
      '| `metacoding-retro` | Looks back at the finished task and proposes lasting changes for its mistakes |'
    );
  });

  test('the workflow runs the retro once per task, after the last ticket is closed', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = sectionOf(rules, '## Tickets', '### Resuming a task');

    expect(tickets).toContain(
      'After the last ticket is closed, use the `metacoding-retro` skill once for the task.'
    );
    expect(tickets).toContain(
      "Those changes come after the last ticket and are not part of the task spec, which stays done."
    );
    expect(tickets).toContain('Its retro follows the close of that one ticket.');
  });

  test('the completion standard names the retro', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const standard = rules.slice(rules.indexOf('## Completion Standard'));

    expect(rules).toContain('## Completion Standard');
    expect(standard).toContain(
      '- after the last ticket is closed, the retro has run and its lessons, if any, have been put to the user'
    );
  });
});

describe('installed skill content: a home for standards', () => {

  test('the layout reference lists the coding standards among the document homes', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const homes = sectionOf(layout, '## MECE Documentation Architecture', '## Project Map');

    expect(homes).toContain(
      "- `/_meta/coding-standards.md`\n  - the repo's rules for writing code, tests, and docs that no automated check enforces"
    );
  });

  test('the layout reference says how a rule reaches the coding standards', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const section = sectionOf(layout, '## Coding Standards', '## Temporary File Management');

    expect(layout.indexOf('## Coding Standards')).toBeGreaterThan(layout.indexOf('## Glossary'));
    expect(section).toContain(
      "`/_meta/coding-standards.md` holds the repo's rules for writing code, tests, and docs that no automated check enforces."
    );
    expect(section).toContain(
      'A rule reaches this file through a retro: the `metacoding-retro` skill proposes it in a lesson and writes it once the user approves.'
    );
    expect(section).toContain(
      'The skill holds the method, and prefers an automated check to a rule.'
    );
    expect(section).toContain(
      'If the repo already keeps its standards somewhere else, use that place.'
    );
    expect(section).toContain(
      'If the repo has no such file, follow `references/platform-adaptation.md`.'
    );
  });

  test('a retro is a second route for a decision record and a glossary term', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const decisions = sectionOf(layout, '## Decision Records', '## Glossary');
    const glossary = sectionOf(layout, '## Glossary', '## Coding Standards');

    expect(decisions).toContain(
      'A retro can add an entry too: the `metacoding-retro` skill proposes it in a lesson and writes it once the user approves.'
    );
    expect(glossary).toContain(
      'Add or correct a term once the scope summary that lists it is confirmed, or once the user approves a lesson from a retro that proposes it.'
    );
  });

  test('a repo with no standards file gets one proposed with the first rule', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const section = sectionOf(adaptation, '## Missing Coding Standards', '## Missing Git Context');

    expect(adaptation.indexOf('## Missing Coding Standards')).toBeGreaterThan(
      adaptation.indexOf('## Missing Glossary or Decision Records')
    );
    expect(section).toContain(
      'If the repo has no file that holds its standards, such as a contributor doc, a style doc, or an agent instruction file:'
    );
    expect(section).toContain(
      '- propose `/_meta/coding-standards.md` with the first new rule a retro puts to the user, and create it with the first rule the user approves'
    );
    expect(section).toContain('- leave it uncreated until there is a rule to put in it');
  });
});

describe('installed skill content: working without the CLI', () => {
  test('the workflow skill reads the project context only when it exists', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const startHere = skill.slice(
      skill.indexOf('## Start Here'),
      skill.indexOf('## Steps')
    );

    expect(skill).toContain('## Start Here');
    expect(skill).toContain('## Steps');
    expect(startHere).toContain(
      "1. Read `references/project-context.md` first when it exists. Without it, find the project's type, tech stack, and test and build commands in the repo."
    );
  });

  test('the workflow skill names a companion skill as a plugin install lists it', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const intro = skill.slice(0, skill.indexOf('## Start Here'));

    expect(skill).toContain('## Start Here');
    expect(intro).toContain(
      "When the skills are installed as a plugin, the name carries the plugin's prefix, such as `metacoding:metacoding-shape`."
    );
  });
});

describe('installed skill content: shape and spec are two skills', () => {
  test('SHAPE-1: shape ends in a decisions summary', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(shape.indexOf('## Closing the interview'));
    const summaryStart = closing.indexOf('```text\nDecisions summary\n');
    const summary = closing.slice(summaryStart, closing.indexOf('```', summaryStart + 3));

    expect(shape).toContain('## Closing the interview');
    expect(summaryStart).toBeGreaterThan(-1);
    for (const field of ['Goal:', 'Decisions made:', 'Terms:', 'Assumptions:']) {
      expect(summary).toContain(`\n${field}\n`);
    }
    expect(closing).toContain(
      'When the user asked only to be questioned, stop here. The decisions summary in the conversation is the result.'
    );
  });

  test('SHAPE-1: shape writes no file and holds no task spec rules', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(shape.indexOf('## Closing the interview'));

    expect(shape).toContain('## Closing the interview');
    expect(closing).toContain('This skill writes no file.');
    for (const moved of [
      '## Solution and tickets',
      '## Records written on confirmation',
      '## The task spec',
      '```text\nScope summary\n',
      '[record]',
    ]) {
      expect(shape).not.toContain(moved);
    }
  });

  test('SHAPE-2: shape hands a task that is to be built over to the spec skill', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(shape.indexOf('## Closing the interview'));

    expect(shape).toContain('## Closing the interview');
    expect(closing).toContain(
      'When the task is to be built, continue with the `metacoding-spec` skill.'
    );
    expect(closing).toContain(
      "gets the user's confirmation, and writes the records. Changing files starts only after that confirmation."
    );
  });

  test('SPEC-1: spec starts from settled decisions and sends an open one to shape', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const start = spec.slice(
      spec.indexOf('## Start from settled decisions'),
      spec.indexOf('## Solution and tickets')
    );

    expect(spec).toContain('## Start from settled decisions');
    expect(spec).toContain('## Solution and tickets');
    expect(start).toContain(
      'the decisions summary of the `metacoding-shape` skill, or what you and the user agreed earlier in the conversation'
    );
    expect(start).toContain(
      'Do not ask the user again for a decision that is already settled.'
    );
    expect(start).toContain(
      'When a decision that would change what gets built or how it is tested is still open, settle it first with the `metacoding-shape` skill'
    );
    expect(start).toContain(
      'The one decision this skill asks itself is how to cut the work into tickets'
    );
  });

  test('the Codex prompts give the interview to shape and the scope summary to spec', async () => {
    const { read } = await installFor('codex');
    const shapePrompt = read('metacoding-shape/agents/openai.yaml');
    const specPrompt = read('metacoding-spec/agents/openai.yaml');

    expect(shapePrompt).toContain('close with a summary of the decisions, terms and assumptions');
    expect(shapePrompt).not.toContain('tickets');
    expect(specPrompt).toContain('$metacoding-spec');
    expect(specPrompt).toContain('get it confirmed before changing anything');
  });

  test('FLOW-1: workflow step 2 uses shape, then spec', async () => {
    const { read } = await installFor('codex');
    const skill = read('metacoding-workflow/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(skill).toContain('2. Shape, with `metacoding-shape` and `metacoding-spec`.');
    expect(shaping.indexOf('Use the `metacoding-shape` skill')).toBeGreaterThan(-1);
    expect(shaping.indexOf('Then use the `metacoding-spec` skill')).toBeGreaterThan(
      shaping.indexOf('Use the `metacoding-shape` skill')
    );
  });

  test('FLOW-1: no file changes before the scope summary is confirmed', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(shaping).toContain(
      'Wait for the user to confirm the scope summary before changing any file.'
    );
  });
});

describe('installed skill content: stories in the scope summary', () => {
  const storiesOf = (spec: string) =>
    sectionOf(spec, '## Stories', '## Solution and tickets');
  const summarySectionOf = (spec: string) =>
    sectionOf(spec, '## The scope summary', '## Records written on confirmation');
  const specFormatOf = (spec: string) =>
    codeBlock(sectionOf(spec, '## The task spec', '## Feature specs'), '```text\n# Task spec:');

  test('SHAPE-3: shape settles a role as a term', async () => {
    const { read } = await installFor('codex');
    const terms = sectionOf(
      read('metacoding-shape/SKILL.md'),
      '## Terms',
      '## Question format'
    );

    expect(terms).toContain('A role is a term too: the kind of user a behavior is for.');
    expect(terms).toContain(
      'When an answer names who a behavior is for and the glossary has no such role, note it and list it under Terms, like any other term.'
    );
  });

  test('SPEC-2: the scope summary lists stories grouped by role, each with Given/When/Then scenarios', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const stories = storiesOf(spec);
    const summarySection = summarySectionOf(spec);

    expect(codeBlock(summarySection, '```text\nScope summary\n')).toContain('\nStories:\n');
    expect(summarySection).toContain(
      'Under "Stories", give the stories as the Stories section describes.'
    );
    expect(stories).toContain(
      'Group the stories by role, and within a role by feature area: a part of the product a user would name'
    );
    expect(stories).toContain(
      '<Role>\n\n<Feature area>: <story title>\nAs a <role>, I want <what>, so that <why>.'
    );
    expect(stories).toContain(
      'Scenario: <ID> <title>\n  Given <the starting state>\n  When <what the role does>\n  Then <what the role can observe>'
    );
    expect(stories).toContain(
      'When a scenario needs more than one Given, When, or Then, start each further line with "And".'
    );
  });

  test('SPEC-2: a task that changes behavior a role can observe has stories, whatever its size', async () => {
    const { read } = await installFor('codex');
    const stories = storiesOf(read('metacoding-spec/SKILL.md'));

    expect(stories).toContain(
      'Describe a task that adds or changes behavior a role can observe as stories, whatever its size.'
    );
    expect(stories).toContain(
      "Use the role's name from the glossary, or from the terms settled for this task."
    );
  });

  test('SPEC-2: scenarios stand in place of success criteria and test intent', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const format = specFormatOf(spec);

    expect(storiesOf(spec)).toContain(
      'The scenarios stand in place of success criteria and test intent: they are what the task must deliver and what its tests must prove.'
    );
    for (const block of [
      codeBlock(summarySectionOf(spec), '```text\nScope summary\n'),
      format,
    ]) {
      expect(block).not.toContain('Success criteria');
      expect(block).not.toContain('Test intent');
    }
    expect(format).toContain('\n## Stories\n');
  });

  test('SPEC-2: each ticket names the scenarios it delivers', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');

    expect(sectionOf(spec, '## Solution and tickets', '## The scope summary')).toContain(
      'Give each ticket the scenarios it delivers.'
    );
    expect(summarySectionOf(spec)).toContain(
      'give each a title and the IDs of the scenarios it delivers'
    );
    expect(specFormatOf(spec)).toContain('- [ ] 1. <title>\n  - Delivers:');
  });

  test('SPEC-2: the workflow rules and the task entry template name the stories', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const template = read('metacoding-workflow/assets/templates/task-entry.md');
    const shaping = sectionOf(rules, '2. Shape the task', '3. Build test-first.');

    expect(shaping).toContain(
      'Close with the scope summary: goal, in and out of scope, solution, stories, decisions, terms, assumptions, and the tickets the solution is sliced into.'
    );
    expect(shaping).toContain('write the behavior as stories');
    expect(template).toContain('- Stories:');
  });

  test('SPEC-3: a task without stories keeps success criteria and test intent', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const summarySection = summarySectionOf(spec);

    expect(storiesOf(spec)).toContain(
      'A task that changes no behavior a role can observe, such as a refactor, tooling, or docs, has no stories. Give it success criteria and test intent instead.'
    );
    expect(summarySection).toContain(
      'A task without stories has "Success criteria:" and "Test intent:" where "Stories:" is.'
    );
    expect(summarySection).toContain(
      'In a task without stories, give each its success criteria and its test intent.'
    );
    expect(sectionOf(spec, '## The task spec', '## Feature specs')).toContain(
      'The task spec of a task without stories has `## Success criteria` and `## Test intent` where `## Stories` is, and each of its tickets gives its success criteria and test intent where "Delivers" is.'
    );
  });

  test('SPEC-3: the workflow rules and the task entry template keep the two fields for a task without stories', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const template = read('metacoding-workflow/assets/templates/task-entry.md');

    expect(sectionOf(rules, '2. Shape the task', '3. Build test-first.')).toContain(
      'A task without stories has success criteria and test intent where the stories are.'
    );
    expect(template).toContain(
      'Give the stories, or the success criteria and test intent when the task has no stories.'
    );
  });

  test('SPEC-4: each scenario has an ID made of its area prefix and a number', async () => {
    const { read } = await installFor('codex');
    const stories = storiesOf(read('metacoding-spec/SKILL.md'));

    expect(stories).toContain(
      'Give each scenario an ID: the prefix of its feature area, a hyphen, and a number, such as `UPDATE-4`.'
    );
    expect(stories).toContain(
      "The prefix is a short name for the area in capitals. Use the one the area's feature spec states, or the one a task spec still in progress uses for the area, and choose one for an area that has none yet."
    );
    expect(stories).toContain(
      "A new scenario takes the number one above the highest that the area's feature spec or any task spec holds for that prefix, whether the task spec is in progress or done."
    );
  });

  test('SPEC-4: a changed scenario keeps its ID', async () => {
    const { read } = await installFor('codex');
    const stories = storiesOf(read('metacoding-spec/SKILL.md'));

    expect(stories).toContain(
      'A scenario the task changes keeps its ID: write "(changed)" after its title.'
    );
    expect(stories).toContain(
      "List the scenarios the task adds, changes, or removes, and leave the area's other scenarios out."
    );
  });
});

describe('installed skill content: task specs and feature specs', () => {
  const taskSpecOf = (spec: string) =>
    sectionOf(spec, '## The task spec', '## Feature specs');
  const featureSpecsOf = (spec: string) => sectionOf(spec, '## Feature specs');

  test('SPEC-5: the task spec goes under tasks/', async () => {
    const { read, files } = await installFor('codex');
    const section = taskSpecOf(read('metacoding-spec/SKILL.md'));

    expect(section).toContain(
      'Put the task spec where the repo already keeps task specs or documents of that kind. When it has no such place, use `/_meta/specs/tasks/<date>-<slug>.md`, with the date as `YYYY-MM-DD`.'
    );
    expect(section).toContain('```text\n# Task spec: <title>');
    // Built from two parts so that a rename across this file cannot rewrite the old place.
    const oldPlace = ['/_meta/specs/', '<date>-<slug>.md'].join('');
    expect(
      files.filter((file) => file.content.includes(oldPlace)).map((file) => file.path)
    ).toEqual([]);
  });

  test('SPEC-5: the rules name the task record a task spec', async () => {
    const { files } = await installFor('codex');
    const bareSpec =
      /\b(?:a|the|its|one|no|whose|any|each|this|that|every|finished|one-ticket) spec\b(?! skill)/i;
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const body = file.content.replace(/^---\n[\s\S]*?\n---\n/, '');
      expect(
        body
          .split('\n')
          .filter((line) => bareSpec.test(line))
          .map((line) => `${file.path}: ${line}`)
      ).toEqual([]);
    }
  });

  test('SPEC-6: a feature spec has one place and one format', async () => {
    const { read } = await installFor('codex');
    const section = featureSpecsOf(read('metacoding-spec/SKILL.md'));

    expect(section).toContain(
      'Put a feature spec where the repo already keeps documents of that kind. When it has no such place, use `/_meta/specs/<area>.md`. Name the area as the scope summary names it, and write that name in lower case with hyphens for the file.'
    );
    const formatStart = section.indexOf('````text\n');
    const format = section.slice(formatStart, section.indexOf('\n````\n', formatStart));

    expect(formatStart).toBeGreaterThan(-1);
    for (const part of [
      '# Feature spec: <area>\n',
      '- ID prefix: <PREFIX>\n',
      '\n## Solution\n',
      '\n## Stories\n',
      '\n### <Role>\n',
      '\n#### <story title>\n',
      'As a <role>, I want <what>, so that <why>.',
      '```gherkin\nScenario: <ID> <title>\n  Given <the starting state>',
    ]) {
      expect(format).toContain(part);
    }
  });

  test('SPEC-6: the Solution section says how one area works today', async () => {
    const { read } = await installFor('codex');
    const section = featureSpecsOf(read('metacoding-spec/SKILL.md'));

    expect(section).toContain(
      "The Solution section says how this one area works today. What spans areas, such as structure, internals, and technical guidance, stays in the repo's system documentation."
    );
  });

  test('SPEC-6: a repo that keeps its scenarios elsewhere keeps them there', async () => {
    const { read } = await installFor('codex');
    const section = featureSpecsOf(read('metacoding-spec/SKILL.md'));

    expect(section).toContain(
      'When the repo already keeps its scenarios somewhere else, such as feature files that a test runner executes, those are its feature specs. Keep them there, follow their own conventions for names and IDs, and write no second copy.'
    );
  });

  test("SPEC-7: a finished ticket's scenarios go into the feature spec of their area", async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const section = featureSpecsOf(spec);

    expect(section).toContain(
      "Write a ticket's scenarios into the feature spec of their area when the ticket is done: after its tests pass, and before it is committed or handed off."
    );
    expect(section).toContain(
      'Do this whether or not the task has a task spec. The feature spec then says only what is built and has a test.'
    );
    expect(section).toContain(
      'Add a new scenario to the `gherkin` block of its story. Add a new story, with its sentence and its own block, under its role.'
    );
    expect(section).toContain(
      'Correct the Solution section when the ticket changed how the area works. A ticket that delivers no scenario still does this, when the area has a feature spec.'
    );
    expect(sectionOf(spec, '## Records written on confirmation', '## The task spec')).toContain(
      'No feature spec is written now. Feature specs are written ticket by ticket, as the Feature specs section describes.'
    );
  });

  test('SPEC-8: the first task in an area starts its feature spec, with no backfill', async () => {
    const { read } = await installFor('codex');
    const section = featureSpecsOf(read('metacoding-spec/SKILL.md'));

    expect(section).toContain(
      'When the area has no feature spec yet, create it with the stories of this ticket only; later tickets add theirs.'
    );
    expect(section).toContain(
      'Do not write stories for behavior that was there before. Say so after the sentence on what the area is for: the file holds the stories settled since the day it was created.'
    );
  });

  test('SPEC-9: a changed scenario is replaced under its ID, and a removed one leaves with its test', async () => {
    const { read } = await installFor('codex');
    const spec = read('metacoding-spec/SKILL.md');
    const whenTicketIsDone = sectionOf(
      featureSpecsOf(spec),
      "Write a ticket's scenarios into the feature spec of their area when the ticket is done",
      'When the area has no feature spec yet'
    );

    expect(whenTicketIsDone).toContain(
      'Replace a scenario the ticket changed: the new text goes under the same ID.'
    );
    expect(whenTicketIsDone).toContain(
      "Delete a scenario the ticket removed, and a story that has no scenario left. The tests that carried the scenario's ID were deleted in the same ticket, during the build."
    );
    expect(whenTicketIsDone).toContain(
      'Leave out the "(changed)" and "(removed)" marks. They belong to the scope summary.'
    );
    expect(sectionOf(spec, '## Solution and tickets', '## The scope summary')).toContain(
      'A scenario the task changes or removes belongs to the ticket that changes or removes it.'
    );
    expect(sectionOf(spec, '## Stories', '## Solution and tickets')).toContain(
      'For a scenario the task removes, give its ID and title with "(removed)" after the title.'
    );
  });
});

describe('installed skill content: the workflow keeps both specs current', () => {
  test('FLOW-2: grounding reads the feature specs of the areas the task touches', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');

    expect(sectionOf(rules, '1. Ground in the repository.', '2. Shape the task')).toContain(
      'Read the feature specs of the feature areas the task touches, when the repo has them: they say what each area does today.'
    );
  });

  test("FLOW-3: the artifact step writes the ticket's scenarios into the feature spec before the commit", async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');

    expect(sectionOf(rules, '6. Update artifacts', '7. Close the loop.')).toContain(
      "Update the feature spec of each feature area the ticket changed, as the `metacoding-spec` skill describes: write the ticket's scenarios into it, and correct its Solution section when the ticket changed how the area works. Do this before the ticket is marked done, so that the feature spec is part of the ticket's commit."
    );
    expect(sectionOf(rules, '## Tickets', '### Resuming a task')).toContain(
      'In step 6, update the feature specs first, then mark the ticket done where the tickets are tracked'
    );
  });

  test('FLOW-3: a task is not complete until its scenarios are in the feature specs', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');

    expect(sectionOf(rules, '## Completion Standard')).toContain(
      '- the scenarios the task delivered are in the feature specs of their areas'
    );
  });

  test('FLOW-4: the layout reference says where feature specs and task specs go', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const prescribed = sectionOf(
      layout,
      '## MECE Documentation Architecture',
      '## Specs, Tickets, and Test Records'
    );
    const records = sectionOf(layout, '## Specs, Tickets, and Test Records', '## Decision Records');

    expect(prescribed).toContain(
      '- `/_meta/specs/`\n  - one feature spec per feature area, as `<area>.md`: how the area works today, and its stories by role\n  - under `tasks/`, one file per task that needs a task spec: its confirmed scope summary and its tickets'
    );
    expect(records).toContain(
      'A feature spec goes where the repo already keeps documents of that kind. When it has no such place, it goes to `/_meta/specs/<area>.md`.'
    );
    expect(records).toContain(
      'A task spec goes where the repo already keeps task specs. When it has no such place, it goes to `/_meta/specs/tasks/<date>-<slug>.md`.'
    );
    expect(records).toContain(
      'holds the rules and the file formats of task specs and feature specs. This reference covers only where things go:'
    );
    expect(prescribed).toContain('- evergreen system behavior that spans feature areas');
  });

  test('FLOW-4: the workflow still creates no separate test document', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');

    expect(
      sectionOf(layout, '## Specs, Tickets, and Test Records', '## Decision Records')
    ).toContain(
      'Scenarios live in the scope summary, in the task spec when the task has one, and in the feature spec, and the tests that prove them carry their IDs. For a task without stories, test intent lives in the scope summary, the task spec, and the tests themselves. If the repo already keeps a test documentation file, keep updating it; do not create one.'
    );
    expect(
      sectionOf(adaptation, '## Missing Test Documentation', '## Missing Glossary or Decision Records')
    ).toContain(
      '- the scenarios, or the test intent of a task without stories, stay where `references/repository-organization.md` says they live, together with the tests themselves\n- leave them there; a separate test document is kept only where the repo already has one'
    );
  });

  test('a repo without feature specs gets one per area as tickets deliver scenarios', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const skill = read('metacoding-workflow/SKILL.md');

    expect(
      sectionOf(adaptation, '## Missing Feature Specs', '## Missing Test Documentation')
    ).toContain(
      "the first ticket that delivers a scenario in an area creates that area's feature spec, as the `metacoding-spec` skill describes"
    );
    expect(skill).toContain(
      'if the repo lacks task docs, feature specs, test docs, or git context.'
    );
  });
});

describe('installed skill content: tests carry scenario IDs', () => {
  test("TDD-1: TDD starts from the ticket's scenarios", async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');

    expect(sectionOf(tdd, '## Before the first loop', '## The loop')).toContain(
      'A scenario is one agreed case of a behavior, written as Given/When/Then, with an ID such as `UPDATE-4`. Start from the scenarios of the ticket you are building, or of the confirmed scope summary when the task is one ticket: each scenario is a behavior on the list.'
    );
    expect(sectionOf(tdd, '## The loop', '## What a good test looks like')).toContain(
      'A scenario stays on the list: it is part of the agreed scope.'
    );
    expect(sectionOf(rules, '3. Build test-first.', '4. Verify.')).toContain(
      'Start from the scenarios of the ticket being built, or of the scope summary when the task is one ticket.'
    );
  });

  test('TDD-1: a task without stories starts from its test intent', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');

    expect(sectionOf(tdd, '## Before the first loop', '## The loop')).toContain(
      'A task without stories has test intent where the scenarios are: a plain list of the behaviors to prove. Start from that.'
    );
    expect(sectionOf(tdd, '## Before the first loop', '## The loop')).toContain(
      '**Nothing agreed.** Write the list yourself.'
    );
    expect(sectionOf(rules, '3. Build test-first.', '4. Verify.')).toContain(
      'A task without stories has test intent where the scenarios are.'
    );
  });

  test('TDD-2: the test that proves a scenario carries its ID in its name', async () => {
    const { read } = await installFor('codex');
    const section = sectionOf(
      read('metacoding-tdd/SKILL.md'),
      '## Tests for scenarios',
      '## When a behavior cannot be tested first'
    );

    expect(section).toContain(
      'The test that proves a scenario carries the ID, so that a search for the ID finds the proof.'
    );
    expect(section).toContain(
      'Put the ID in the name of the test, as in "UPDATE-4: keeps the saved settings". Where a name cannot hold it, put it in a comment or a tag on the test.'
    );
    expect(section).toContain(
      'This section applies when the change has scenarios: agreed cases with an ID each, from the scope summary, a ticket, or a feature spec. Use the IDs you were given, and never make one up.'
    );
    expect(section).toContain(
      'When the ticket changes a scenario, change the tests that carry its ID. When it removes a scenario, delete them.'
    );
    expect(section).toContain(
      'When a scenario needs more than one test, each of them carries the ID.'
    );
  });

  test('TDD-2: lower-level tests may be added without an ID', async () => {
    const { read } = await installFor('codex');
    const section = sectionOf(
      read('metacoding-tdd/SKILL.md'),
      '## Tests for scenarios',
      '## When a behavior cannot be tested first'
    );

    expect(section).toContain(
      'A test for a lower-level case that no scenario names carries no ID.'
    );
  });

  test('TDD-2: TDD is done when every scenario has a test that carries its ID', async () => {
    const { read } = await installFor('codex');

    const done = sectionOf(read('metacoding-tdd/SKILL.md'), '## Done');

    expect(done).toContain(
      'Every scenario the change adds or changes has a test that carries its ID, and every other behavior on the list has a test. Each of these tests was seen failing and now passes. The one behavior without a test is a behavior with a recorded exception.'
    );
    expect(done).toContain('No test carries the ID of a scenario the change removed.');
  });

  test('REVIEW-1: review checks a ticket against the scenarios it delivers', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');

    expect(sectionOf(review, '## What to review', '## Who reviews')).toContain(
      "When the change is one ticket of a larger task, the agreed scope is the scenarios that ticket delivers, read together with the task's in-scope and out-of-scope lists. A scenario is one agreed case of a behavior, written as Given/When/Then, with an ID. In a task without stories, the ticket's success criteria and test intent take the place of the scenarios."
    );
  });

  test('REVIEW-2: review finds an unproven scenario by searching the tests for its ID', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const scopeAxis = sectionOf(review, '**Scope.**', '**Standards.**');

    expect(scopeAxis).toContain(
      '- Unproven: a scenario with no test that proves it, or a behavior in the test intent with no test that exercises it. Search the tests for each scenario\'s ID. A scenario is unproven when no test carries its ID, or when the test that carries it does not check what the scenario\'s "Then" says.'
    );
    expect(scopeAxis).toContain(
      'For a scenario the change removes, the check is the opposite: a test that still carries its ID is a Wrong finding.'
    );
    expect(sectionOf(review, '## Who reviews', '## The two axes')).toContain(
      "The repo's tests are one of the scope axis's inputs, because it searches them for scenario IDs."
    );
  });

  test('REVIEW-2: the whole-change pass searches for every scenario of the task', async () => {
    const { read } = await installFor('codex');
    const finalPass = sectionOf(read('metacoding-review/SKILL.md'), '## After the last ticket', '## Report');

    expect(finalPass).toContain(
      'Search the tests once more for the ID of every scenario the task delivers.'
    );
  });

  test("DEBUG-1: the regression test carries the scenario's ID", async () => {
    const { read } = await installFor('codex');
    const fix = sectionOf(
      read('metacoding-debug/SKILL.md'),
      '## 5. Fix with a regression test',
      '## 6. Clean up'
    );

    expect(fix).toContain(
      "A scenario is an agreed case of a behavior with an ID, found in the task's agreed scope or in the repo's feature spec for that area. When the broken behavior is one, give the test that scenario's ID: in its name, or in a comment or tag where a name cannot hold it."
    );
  });
});
