import fs from 'node:fs';
import { join } from 'node:path';
import { FilesFinder } from '@domain/utils';

const rootPath = process.cwd();

export class FilesFinderAdapter implements FilesFinder {
  find(dir: string, match: string | RegExp): string[] {
    const dirPath = this.makeDirPath(dir);
    const files: string[] = [];
    const fileMatcher = typeof match === 'string' ? this.makeMatcher(match) : match;

    const foundedFiles = fs.readdirSync(dirPath);

    for (const file of foundedFiles) {
      const fullPath = join(dirPath, file);

      if (fileMatcher.test(file)) files.push(fullPath);
      if (this.isDirectory(file)) files.push(...this.find(fullPath, fileMatcher));
    }

    return files;
  }

  private makeDirPath(dir: string) {
    const pathFolders = dir.split('/');
    return join(rootPath, ...pathFolders);
  }

  private makeMatcher(matchString: string): RegExp {
    const matcher = matchString.replace(/\./g, '\\.').replace(/\*/g, '(.+)');
    return new RegExp(matcher, 'g');
  }

  private isDirectory(path: string): boolean {
    return !this.isFile(path);
  }

  private isFile(path: string): boolean {
    return /.+(\..+)$/g.test(path);
  }
}
