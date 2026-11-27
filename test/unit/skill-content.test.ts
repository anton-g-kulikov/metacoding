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

  test('the layout reference keeps existing task and test records without prescribing new ones', async () => {
    const { read } = await installFor('codex');
    const layout = read('metacoding-workflow/references/repository-organization.md');
    const prescribed = layout.slice(
      layout.indexOf('## MECE Documentation Architecture'),
      layout.indexOf('## Task and Test Records')
    );

    expect(layout).toContain('## Task and Test Records');
    expect(prescribed).not.toContain('project-task-list.md');
    expect(prescribed).not.toContain('test-documentation.md');
    expect(layout).toContain('keep updating it');
    expect(layout).toContain('Create neither');
    expect(layout).not.toContain('test documentation belongs under `/test`');
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
      'Decisions made:',
      'Assumptions:',
      'Test intent:',
    ];

    for (const field of summaryFields) {
      expect(interview).toContain(`\n${field}`);
      expect(template).toContain(`- ${field}`);
    }
  });

  test('the interview records settled terms and marks decisions to record', async () => {
    const { read } = await installFor('codex');
    const interview = read('metacoding-shape/SKILL.md');

    expect(interview).toContain('## Terms');
    expect(interview).toContain('`/_meta/glossary.md`');
    expect(interview).toContain('propose');
    expect(interview).toContain('[record]');
    expect(interview).toContain('hard to reverse');
    expect(interview).toContain('decision record');
  });

  test('the workflow reads the glossary while grounding and writes marked decision records at the end', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const skill = read('metacoding-workflow/SKILL.md');
    const grounding = rules.slice(
      rules.indexOf('1. Ground in the repository.'),
      rules.indexOf('2. Shape the task')
    );
    const artifacts = rules.slice(
      rules.indexOf('6. Update artifacts'),
      rules.indexOf('7. Close the loop.')
    );

    expect(grounding).toContain('glossary');
    expect(grounding).toContain('decision records');
    expect(artifacts).toContain('[record]');
    expect(artifacts).toContain('`/_meta/architecture-decisions.md`');
    expect(skill).toContain('glossary');
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

  test('the workflow rules name the solution and the tickets in the scope summary', async () => {
    const { read } = await installFor('codex');
    const rules = read('metacoding-workflow/references/workflow-rules.md');
    const summaryLine = rules
      .split('\n')
      .find((line) => line.includes('Close with the scope summary'));

    expect(summaryLine).toContain('solution');
    expect(summaryLine).toContain('tickets');
  });

  test('the solution names the approach and what changes', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const section = shape.slice(
      shape.indexOf('## Solution and tickets'),
      shape.indexOf('## Closing the interview')
    );

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

    expect(section).toContain('put the cut to the user as a decision');
    expect(shape).toContain('how it is sliced into tickets');
  });

  test('the scope summary lists tickets in build order with their criteria and test intent', async () => {
    const { read } = await installFor('codex');
    const shape = read('metacoding-shape/SKILL.md');
    const closing = shape.slice(shape.indexOf('## Closing the interview'));

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
