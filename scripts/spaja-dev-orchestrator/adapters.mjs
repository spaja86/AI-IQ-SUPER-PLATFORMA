import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { manifest, moduleFiles, digest, safeFile } from './policy.mjs';

export function writeModule(task, directory) {
  const files = moduleFiles(task);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(directory, name), content, { flag: 'wx', mode: 0o600 });
  return Object.entries(files).map(([name, content]) => ({ name, sha256: digest(content) }));
}
export function verifySource(task, directory) {
  for (const [name, expected] of Object.entries(moduleFiles(task))) {
    if (readFileSync(safeFile(directory, name), 'utf8') !== expected) throw new Error('Generated artifact changed; verification refused.');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [kind, input] = process.argv.slice(2);
  const payload = JSON.parse(input);
  if (kind === 'generate-module') console.log(JSON.stringify(writeModule(payload.task, payload.directory)));
  else if (kind === 'file-manifest') {
    const entries = manifest(payload.workspace, payload.task.files);
    writeFileSync(join(payload.directory, 'manifest.json'), JSON.stringify(entries, null, 2), { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify(entries));
  } else throw new Error('Unsupported worker adapter.');
}
