import { SkillManager } from '../../src/services/skill-manager';
import { AgentVendor } from '../../src/types';

const skillsDirs: Record<AgentVendor, string> = {
  codex: '.codex/skills',
  'claude-code': '.claude/skills',
  antigravity: '.agents/skills',
};

async function installFor(vendor: AgentVendor) {
  const files = await new SkillManager().generateInstallationFiles({
    name: 'demo-app',
    description: 'Demo application',
    techStack: ['TypeScript'],
    projectType: 'typescript',
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
      layout.indexOf('## Specs, Tickets, and Test Records')
    );
    const records = layout.slice(
      layout.indexOf('## Specs, Tickets, and Test Records'),
      layout.indexOf('## Decision Records')
    );

    expect(layout).toContain('## MECE Documentation Architecture');
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
    expect(skill).toContain('glossary');
    expect(skill).toContain('amend any decision record the build proved wrong');
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
    const skill = read('metacoding-workflow/SKILL.md');
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
    expect(skill).toContain(
      'the skill then writes the settled terms, the marked decision records, and a spec when the task needs one'
    );
  });
});
