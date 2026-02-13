#!/usr/bin/env node
const { spawn } = require('child_process');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: pnpm dev <appName>   (example: pnpm dev timestable)');
  process.exit(1);
}

const app = args[0];
const extra = args.slice(1);

const selector = `./apps/${app}`;
const cmd = 'pnpm';
const cmdArgs = ['--filter', selector, 'dev', ...extra];

const child = spawn(cmd, cmdArgs, { stdio: 'inherit', shell: true });

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
