import { readFileSync } from 'node:fs';

// Branch CI has no production secrets. Require the source contracts, while keeping
// deployment-time `predeploy:check -- --strict` as a separate operator gate.
const filename = process.argv[2];
if (!filename) throw new Error('A predeploy output file is required');
const output = readFileSync(filename, 'utf8');
const marker = '=== Predeploy Check ===\n';
const position = output.indexOf(marker);
if (position < 0) throw new Error('Full predeploy report is missing (fast mode is not accepted)');
// stdout from predeploy-check.mjs is a heading followed by one JSON document.
const report = JSON.parse(output.slice(position + marker.length).trim());
if (report.mode !== 'full') throw new Error('Full contract validation is required');
const required = ['analizaSvega', 'potencijalSvegaOvogaDoSada',
  'ekstremnoProcesuiranjeSvega', 'procesuiranje3', 'maksimusSvega'];
for (const name of required) {
  if (report[name]?.contractReady !== true) throw new Error(`Predeploy contract failed or missing: ${name}`);
}
console.log('All 5 mandatory source contracts passed. Production configuration is NOT validated.');
