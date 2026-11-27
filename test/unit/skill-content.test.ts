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
    expect(records).toContain('`metacoding-shape` skill decides which tasks need a spec');
    expect(records).toContain('where the repo already keeps specs');
    expect(records).toContain('`/_meta/specs/<date>-<slug>.md`');
    expect(records).toContain("go to the repo's tracker when it keeps one current");
    expect(records).toContain('checklist in the spec');
    expect(records).toContain('do not create one');
    expect(layout).not.toContain('Create neither');
    expect(layout).not.toContain('test documentation belongs under `/test`');
  });

  test('a repo without a tracker keeps the tickets as a checklist in the spec', async () => {
    const { read } = await installFor('codex');
    const adaptation = read('metacoding-workflow/references/platform-adaptation.md');
    const section = adaptation.slice(
      adaptation.indexOf('## Missing Task Tracking'),
      adaptation.indexOf('## Missing Test Documentation')
    );

    expect(adaptation).toContain('## Missing Task Tracking');
    expect(adaptation).toContain('## Missing Test Documentation');
    expect(section).toContain('checklist in the spec');
    expect(section).toContain('`/_meta/specs/<date>-<slug>.md`');
    expect(section).toContain('needs no spec');
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
    const interview = read('metacoding-shape/SKILL.md');
    const summaryFields = [
      'Goal:',
      'Success criteria:',
      'In scope:',
      'Out of scope:',
      'Solution:',
      'Decisions made:',
      'Terms:',
      'Assumptions:',
      'Test intent:',
      'Tickets:',
    ];

    for (const field of summaryFields) {
      expect(interview).toContain(`\n${field}`);
      expect(template).toContain(`- ${field}`);
    }
  });

  test('shape lists settled terms in the scope summary and writes nothing before confirmation', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const terms = shape.slice(
      shape.indexOf('## Terms'),
      shape.indexOf('## Question format')
    );
    const summaryStart = shape.indexOf('```text\nScope summary\n');
    const summary = shape.slice(summaryStart, shape.indexOf('```', summaryStart + 3));

    expect(shape).toContain('## Terms');
    expect(shape).toContain('## Question format');
    expect(summaryStart).toBeGreaterThan(-1);
    expect(terms).toContain('list it under Terms in the scope summary');
    expect(terms).toContain('Nothing is written to the glossary until the summary is confirmed');
    expect(summary).toContain('\nTerms:\n');
    expect(shape).toContain(
      'propose creating one there, by default at `/_meta/glossary.md`: confirming the summary approves it'
    );
    expect(shape).not.toContain('straight away');
    expect(shape).not.toContain('before the scope summary is confirmed');
  });

  test('shape marks the decisions to record against a three-part bar', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');

    const closing = shape.slice(
      shape.indexOf('## Closing the interview'),
      shape.indexOf('## Records written on confirmation')
    );

    expect(shape).toContain('## Closing the interview');
    expect(shape).toContain('## Records written on confirmation');
    expect(closing).toContain('put `[record]` in front of each decision');
    expect(closing).toContain(
      'hard to reverse, surprising without context, and a real trade-off'
    );
    expect(closing).toContain(
      'Confirming the summary also approves writing those as decision records.'
    );
  });

  test('shape writes the terms and the marked decisions once the summary is confirmed', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const records = shape.slice(
      shape.indexOf('## Records written on confirmation'),
      shape.indexOf('## The spec')
    );

    expect(shape).toContain('## Records written on confirmation');
    expect(shape).toContain('## The spec');
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
    expect(records).toContain('**The spec.** Write it when the task needs one');
    expect(shape).not.toContain('once the work is done');
  });

  test('an instruction to proceed without questions stands in for the confirmation', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');

    expect(shape).toContain(
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
      layout.indexOf('## Temporary File Management')
    );

    expect(layout).toContain('## Decision Records');
    expect(layout).toContain('## Glossary');
    expect(layout).toContain('## Temporary File Management');
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
      adaptation.indexOf('## Missing Git Context')
    );

    expect(adaptation).toContain('## Missing Glossary or Decision Records');
    expect(adaptation).toContain('## Missing Git Context');
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
      'Amend a decision record the build proved wrong, as the `metacoding-shape` skill describes'
    );
    expect(artifacts).not.toContain('Write each decision marked');
    expect(skill).not.toContain('write the decision records the scope summary marked');
    expect(skill).not.toContain('bootstrap');
  });
});

describe('installed skill content: solution and tickets', () => {
  test('the scope summary states the solution and the tickets', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const summaryStart = shape.indexOf('```text\nScope summary\n');
    const summary = shape.slice(summaryStart, shape.indexOf('```', summaryStart + 3));

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
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(
      shape.indexOf('## Solution and tickets'),
      shape.indexOf('## Closing the interview')
    );

    expect(shape).toContain('## Solution and tickets');
    expect(shape).toContain('## Closing the interview');
    expect(section).toContain('the approach');
    expect(section).toContain('public interface');
  });

  test('shape slices the solution into tickets that are vertical slices', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(
      shape.indexOf('## Solution and tickets'),
      shape.indexOf('## Closing the interview')
    );

    expect(shape).toContain('## Solution and tickets');
    expect(shape).toContain('## Closing the interview');
    expect(section).toContain('built, verified, reviewed, and committed on its own');
    expect(section).toContain('vertical slice');
    expect(section).toContain('its own success criteria and test intent');
    expect(section).toContain('each builds on the ones before it');
  });

  test('an open choice of how to slice goes to the user as a decision', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(
      shape.indexOf('## Solution and tickets'),
      shape.indexOf('## Closing the interview')
    );

    expect(shape).toContain('## Solution and tickets');
    expect(shape).toContain('## Closing the interview');
    expect(section).toContain('put the cut to the user as a decision');
    expect(shape).toContain('how it is sliced into tickets');
  });

  test('the scope summary lists tickets in build order with their criteria and test intent', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(shape.indexOf('## Closing the interview'));

    expect(shape).toContain('## Closing the interview');
    expect(closing).toContain('number the tickets in build order');
    expect(closing).toContain('a title, its success criteria, and its test intent');
    expect(closing).toContain('For a one-ticket task, give the title alone');
  });

  test('a small task stays one ticket', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');

    expect(shape).toContain('A small task is one ticket');
  });
});

describe('installed skill content: the spec', () => {
  test('shape writes a spec after confirmation for more than one ticket or a marked decision', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain('Write a spec when either is true');
    expect(section).toContain('The summary has more than one ticket.');
    expect(section).toContain('The summary has a decision marked `[record]`.');
    expect(shape).toContain('# Shape');
    expect(shape.slice(0, shape.indexOf('# Shape'))).toContain(
      'a spec when the task has more than one ticket or a decision to record'
    );
  });

  test('a one-ticket task with no marked decision gets no spec', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain('needs no spec');
    expect(section).toContain('where the repo already tracks work');
    expect(section).toContain('the summary in the conversation is the record');
  });

  test("the spec goes to the repo's own place or /_meta/specs", async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain('where the repo already keeps specs');
    expect(section).toContain('`/_meta/specs/<date>-<slug>.md`');
    expect(section).toContain('`YYYY-MM-DD`');
  });

  test('the spec holds a status, the scope summary fields, and the tickets', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));
    const formatStart = section.indexOf('```text\n# Spec:');
    const format = section.slice(formatStart, section.indexOf('```', formatStart + 3));

    expect(shape).toContain('## The spec');
    expect(formatStart).toBeGreaterThan(-1);
    expect(format).toContain('- Status: in progress');
    for (const heading of [
      '## Goal',
      '## Success criteria',
      '## In scope',
      '## Out of scope',
      '## Solution',
      '## Decisions made',
      '## Terms',
      '## Assumptions',
      '## Test intent',
      '## Tickets',
    ]) {
      expect(format).toContain(`\n${heading}\n`);
    }
    expect(format).toContain('- [ ] 1. <title>\n  - Success criteria:\n  - Test intent:');
    expect(section).toContain('A one-ticket spec lists its ticket by title alone.');
  });

  test("tickets go to the repo's tracker when it keeps one current, otherwise the spec is the tracker", async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain('When the repo keeps a tracker current');
    expect(section).toContain('create the tickets there and link each one from the spec');
    expect(section).toContain('the checklist in the spec is the tracker');
  });

  test('a finished spec is marked done and stays in place unchanged', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain("set the spec's status to done");
    expect(section).toContain('leave the spec in place and unchanged');
    expect(section).toContain("belong in the repo's system documentation");
  });

  test('the workflow leaves the records and the spec to the shape skill', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(shaping).toContain(
      'Once the summary is confirmed, the skill writes the settled terms to the glossary and the decisions marked `[record]` to the decision records, and a spec when the task needs one.'
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

  test('a ticket is marked done in the artifact step, and the spec with the last ticket', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain('In step 6, mark the ticket done where the tickets are tracked');
    expect(tickets).toContain("is part of the ticket's commit");
    expect(tickets).toContain(
      'With the last ticket, mark the spec done, as the `metacoding-shape` skill describes.'
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

  test('the last ticket also gets the whole change reviewed against the spec', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const tickets = rules.slice(
      rules.indexOf('## Tickets'),
      rules.indexOf('## Scope Control')
    );

    expect(rules).toContain('## Tickets');
    expect(rules).toContain('## Scope Control');
    expect(tickets).toContain(
      'In step 5 of the last ticket, the `metacoding-review` skill also checks the whole change against the spec.'
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
    expect(tickets).toContain('When it has a spec, step 6 marks its ticket and the spec done');
    expect(build).toContain(
      'Take the test intent from the ticket being built, or from the scope summary when the task is one ticket.'
    );
  });

  test('grounding looks for a spec in progress', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const grounding = rules.slice(
      rules.indexOf('1. Ground in the repository.'),
      rules.indexOf('2. Shape the task')
    );

    expect(rules).toContain('1. Ground in the repository.');
    expect(rules).toContain('2. Shape the task');
    expect(grounding).toContain(
      'Look for a spec whose status is in progress, where `references/repository-organization.md` says specs go.'
    );
    expect(grounding).toContain(
      'When the request continues that task, resume it as the Tickets section describes.'
    );
  });

  test('an unfinished task resumes from its spec at the first ticket not done', async () => {
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
    expect(resuming).toContain('The spec is the agreed scope. Skip step 2.');
    expect(resuming).toContain(
      'Start at the first ticket that is not marked done where the tickets are tracked, and follow the rules above from there, including the wait before each next ticket.'
    );
    expect(steps).toContain(
      'When the request continues a task that an earlier session left unfinished, the task resumes from its spec at the first ticket not yet done, as the same section describes.'
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
      'Ask the user which task to work on when more than one spec is in progress, or when you cannot tell whether the request belongs to the spec.'
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

  test('the completion standard requires closed tickets and a spec marked done', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const completion = rules.slice(rules.indexOf('## Completion Standard'));

    expect(rules).toContain('## Completion Standard');
    expect(completion).toContain(
      'every ticket is closed and, when the task has a spec, the spec is marked done'
    );
  });

  test('TDD starts from the test intent of the ticket being built', async () => {
    const { read } = await installFor('codex');
    const tdd = read('metacoding-tdd/SKILL.md');
    const before = tdd.slice(
      tdd.indexOf('## Before the first loop'),
      tdd.indexOf('## The loop')
    );

    expect(tdd).toContain('## Before the first loop');
    expect(tdd).toContain('## The loop');
    expect(before).toContain(
      'Start from the test intent of the ticket you are building, when the task has more than one ticket; otherwise from the test intent of the confirmed scope summary, when one exists.'
    );
  });

  test('review checks a ticket against its own criteria and the task scope lists', async () => {
    const { read } = await installFor('codex');
    const review = read('metacoding-review/SKILL.md');
    const what = review.slice(
      review.indexOf('## What to review'),
      review.indexOf('## Who reviews')
    );

    expect(review).toContain('## What to review');
    expect(review).toContain('## Who reviews');
    expect(what).toContain(
      "that ticket's success criteria and test intent, read together with the task's in-scope and out-of-scope lists"
    );
  });

  test('review checks the whole change against the spec with the last ticket', async () => {
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
      "Compare the whole change with the task's spec or scope summary: its goal, its success criteria, and its in-scope and out-of-scope lists."
    );
    expect(finalPass).toContain("Tickets can each pass while the task's goal is still missed.");
  });

  test('shape says the tickets are built and reviewed one at a time', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(
      shape.indexOf('## Closing the interview'),
      shape.indexOf('## Records written on confirmation')
    );

    expect(shape).toContain('## Closing the interview');
    expect(shape).toContain('## Records written on confirmation');
    expect(closing).toContain(
      "the tickets are built one at a time, each ticket's test intent seeds its test-first work, and reviews check each ticket and then the whole change against the summary."
    );
  });

  test('a ticket in the spec checklist is ticked when it is done', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(shape.indexOf('## The spec'));

    expect(shape).toContain('## The spec');
    expect(section).toContain(
      'the checklist in the spec is the tracker: tick a ticket when it is done.'
    );
  });

  test('a change to a spec in progress is confirmed and written into the spec first', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const section = shape.slice(shape.indexOf('## The spec'));
    const resuming = rules.slice(
      rules.indexOf('### Resuming a task'),
      rules.indexOf('## Scope Control')
    );

    for (const marker of ['### Resuming a task', '## Scope Control']) {
      expect(rules).toContain(marker);
    }
    expect(shape).toContain('## The spec');
    expect(section).toContain(
      'While the spec is in progress, a change to what it agreed is a decision for the user. Once they confirm it, write the change into the spec with its date before building it.'
    );
    expect(resuming).toContain(
      'When the request changes what the spec agreed, settle the change first, as the `metacoding-shape` skill describes for a spec in progress.'
    );
  });

  test('the records shape writes are committed on their own before the build', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const shaping = rules.slice(
      rules.indexOf('2. Shape the task'),
      rules.indexOf('3. Build test-first.')
    );

    expect(rules).toContain('2. Shape the task');
    expect(rules).toContain('3. Build test-first.');
    expect(shaping).toContain(
      "When VCS work is in scope, commit the records the skill wrote on their own before the build starts, so that a ticket's commit holds only that ticket's work. A confirmed change to a spec in progress is committed the same way."
    );
  });

  test('the Codex prompt for the workflow resumes a task whose spec is in progress', async () => {
    const { read } = await installFor('codex');
    const prompt = read('metacoding-workflow/agents/openai.yaml');

    expect(prompt).toContain(
      'resume a task whose spec is still in progress or interview me on the open decisions and confirm the scope summary'
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
      'A paused task with a spec continues as the Resuming a task section describes.'
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
        '2. Shape, with `metacoding-shape`.',
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
      'and any spec still in progress',
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
      'The metacoding workflow and the `metacoding-shape` skill read that file.'
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
      '- Tracker: <GitHub issues, a file path, or none: the checklist in each spec>\n' +
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
      'The tracker line says where the repo tracks work: the tickets of a spec go there, and so does a request queued for later.'
    );
    expect(format).toContain(
      'A line that says none means the repo tracks work nowhere, and the tickets are a checklist in each spec.'
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

  test('onboarding recommends the defaults of the shape skill for what the repo lacks', async () => {
    const { read } = await installFor('codex');
    const onboard = read('metacoding-onboard/SKILL.md');
    const section = sectionOf(onboard, '## 2. Ask', '### The pointer');

    expect(section).toContain(
      'For a place the repo does not have, recommend the default: the place the `metacoding-shape` skill uses in a repo that has none.'
    );
    expect(section).toContain('`../metacoding-shape/SKILL.md`');
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
      'is created by the `metacoding-shape` skill when a task first needs it, at the path recorded here'
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
      'A line that says none is an answer too: the repo tracks work nowhere, and the tickets are a checklist in the spec.'
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
  });

  test('shape reads and writes its records where the project map says', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = sectionOf(shape, '## The project map', '## Terms');

    expect(section).toContain(
      'Where the project map names a place, use that place wherever this skill reads or writes the glossary, a decision record, a spec, or a ticket, and create it there when it does not exist yet.'
    );
  });

  test('shape falls back to its defaults for a missing line or a missing project map', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = sectionOf(shape, '## The project map', '## Terms');

    expect(section).toContain(
      "The default places and the rules for a repo's own place, below, apply only to a place the project map has no line for, and to a repo with no project map."
    );
  });

  test('shape on its own treats a tracker line that says none as an answer', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = sectionOf(shape, '## The project map', '## Terms');

    expect(section).toContain('The tracker line says where this repo tracks work.');
    expect(section).toContain(
      'A line that says none is an answer too: the repo tracks work nowhere, and the checklist in the spec is the tracker.'
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
    const { read } = await installFor('codex');
    const design = read('metacoding-design/SKILL.md');
    const rule = design.slice(
      design.indexOf('### 7. Design a lasting interface more than once')
    );

    expect(design).toContain('### 7. Design a lasting interface more than once');
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
      'Companion skills own the method of single steps, or of one part of a step, and each also works on its own:'
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
