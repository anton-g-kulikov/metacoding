import { InitCommand } from '../../src/commands/init';
import { UpdateCommand } from '../../src/commands/update';
import { Command } from 'commander';
import { main } from '../../src/cli';

describe('CLI', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  const originalArgv = process.argv;

  beforeEach(() => {
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);
    logSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.argv = originalArgv;
    exitSpy.mockRestore();
    logSpy.mockRestore();
    jest.restoreAllMocks();
  });

  test('dispatches init command', async () => {
    const initSpy = jest
      .spyOn(InitCommand.prototype, 'execute')
      .mockResolvedValue(undefined);

    process.argv = ['node', 'metacoding', 'init', '--template', 'react'];
    await main();

    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({ template: 'react' })
    );
  });

  test('dispatches update command', async () => {
    const updateSpy = jest
      .spyOn(UpdateCommand.prototype, 'execute')
      .mockResolvedValue(undefined);

    process.argv = ['node', 'metacoding', 'update', '--dry-run'];
    await main();

    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ dryRun: true })
    );
  });

  test('reports init failures and exits with code 1', async () => {
    jest
      .spyOn(InitCommand.prototype, 'execute')
      .mockRejectedValue(new Error('boom'));

    process.argv = ['node', 'metacoding', 'init'];
    await main();

    expect(logSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('reports update failures and exits with code 1', async () => {
    jest
      .spyOn(UpdateCommand.prototype, 'execute')
      .mockRejectedValue(new Error('boom'));

    process.argv = ['node', 'metacoding', 'update'];
    await main();

    expect(logSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('shows help when no command is provided', async () => {
    const helpSpy = jest
      .spyOn(Command.prototype, 'help')
      .mockImplementation((() => undefined) as never);

    process.argv = ['node', 'metacoding'];
    await main();

    expect(helpSpy).toHaveBeenCalled();
  });
});
