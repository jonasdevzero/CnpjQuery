import fs from 'node:fs';
import { join } from 'node:path';

const rootPath = process.cwd();
const routesDirectory = join(rootPath, 'src', 'main', 'routes');

export class GetRoutesFiles {
  static get(): string[] {
    return this.read(routesDirectory);
  }

  private static read(dir: string): string[] {
    const files: string[] = [];

    fs.readdirSync(dir).forEach((file) => {
      if (this.isRouteFile(file)) files.push(join(dir, file));

      if (this.isDirectory(file)) {
        const directory = join(dir, file);
        files.push(...this.read(directory));
      }
    });

    return files;
  }

  private static isRouteFile(path: string): boolean {
    return /.+(\.routes\.ts)$/g.test(path);
  }

  private static isDirectory(path: string): boolean {
    return !this.isFile(path);
  }

  private static isFile(path: string): boolean {
    return /.+(\..+)$/g.test(path);
  }
}
