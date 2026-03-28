import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

export async function createTempWorkspace(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), `${prefix}-`));
}
