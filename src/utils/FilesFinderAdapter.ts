import fs from 'node:fs';
import { join } from 'node:path';
import { FilesFinder } from '../domain/utils/FilesFinder';

const rootPath = process.cwd();

export class FilesFinderAdapter implements FilesFinder {
  find(dir: string, match: string | RegExp): string[] {
    const dirPath = this.makeDirPath(dir);

    fs.readdirSync(dirPath);

    return [];
  }

  private makeDirPath(dir: string) {
    const pathFolders = dir.split('/');
    return join(rootPath, ...pathFolders);
  }
}
