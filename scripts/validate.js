const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const required = [
  'extension/CSXS/manifest.xml', 'extension/index.html', 'extension/host/host.jsx',
  'extension/scripts/panel.js', 'extension/scripts/cep-bridge.js',
  'extension/shared/core.js', 'extension/features/catalog.js',
  'docs/FEATURES.md', 'docs/ARCHITECTURE.md', 'docs/INSTALLATION.md'
];
let failed = false;
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) { console.error(`Missing required file: ${file}`); failed = true; }
}
const manifest = fs.readFileSync(path.join(root, 'extension/CSXS/manifest.xml'), 'utf8');
if (!manifest.includes('<Host Name="PPRO"') || !manifest.includes('<Host Name="AEFT"')) {
  console.error('Manifest must declare both Premiere Pro and After Effects.'); failed = true;
}
if (/\u003c\s*(?:lifecycle|[a-z]+\?)\s*\u003e/i.test(manifest) || manifest.includes('< elektr?') || manifest.includes('< lifecycle')) {
  console.error('Manifest contains malformed placeholder tags.'); failed = true;
}
if ((manifest.match(/<ExtensionManifest\b/g) || []).length !== 1 || (manifest.match(/<\/ExtensionManifest>/g) || []).length !== 1) {
  console.error('Manifest root tag is not balanced.'); failed = true;
}
if (failed) process.exit(1);
console.log(`RahilFX scaffold validation passed (${required.length} required files).`);
