#!/usr/bin/env node
'use strict';

// Validates one or more schema instance files against schema/handoff-schema.json.
//
// Usage:
//   node scripts/validate-schema.js path/to/instance.json [more.json ...]
//
// Exit code: 0 if all valid, 1 otherwise.

const fs   = require('fs');
const path = require('path');

let Ajv;
try {
  Ajv = require('ajv/dist/2020');
} catch (e) {
  console.error('Missing dependency: ajv. Run: npm install');
  process.exit(2);
}

const SCHEMA_PATH = path.join(__dirname, '..', 'schema', 'handoff-schema.json');
const schema      = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const ajv         = new Ajv({ allErrors: true, strict: true });
const validate    = ajv.compile(schema);

function check(file) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`✗ ${file} — invalid JSON: ${e.message}`);
    return false;
  }

  if (validate(data)) {
    console.log(`✓ ${file}`);
    return true;
  }

  console.error(`✗ ${file}`);
  for (const err of validate.errors) {
    console.error(`    ${err.instancePath || '(root)'}  ${err.message}`);
  }
  return false;
}

function expandGlobs(args) {
  // tiny built-in glob: supports `*` inside a single directory path
  const out = [];
  for (const arg of args) {
    if (!arg.includes('*')) { out.push(arg); continue; }
    const dir = path.dirname(arg);
    const pattern = path.basename(arg).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    const re = new RegExp(`^${pattern}$`);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (re.test(name)) out.push(path.join(dir, name));
    }
  }
  return out;
}

const files = expandGlobs(process.argv.slice(2));

if (files.length === 0) {
  console.error('Usage: node scripts/validate-schema.js <file.json> [more.json ...]');
  process.exit(2);
}

const results = files.map(check);
process.exit(results.every(Boolean) ? 0 : 1);
