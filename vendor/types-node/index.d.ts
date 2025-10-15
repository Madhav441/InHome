// Minimal Node.js type declarations for the offline sandbox.
// This is not a complete definition file. It only includes the pieces
// required by the repository to compile basic utility scripts.

declare var process: {
  env: { [key: string]: string | undefined };
  argv: string[];
  stdout: { write: (chunk: string) => void };
  exit(code?: number): never;
};

declare var require: {
  (id: string): any;
  main?: any;
};

declare var module: {
  exports: any;
};

declare var __dirname: string;

declare module 'fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding: string): string;
  export function writeFileSync(path: string, data: string, encoding?: string): void;
}

declare module 'path' {
  export function resolve(...parts: string[]): string;
  export function join(...parts: string[]): string;
  export function dirname(p: string): string;
  export function parse(p: string): { root: string };
}
