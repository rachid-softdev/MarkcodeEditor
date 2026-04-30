#!/usr/bin/env node

const { spawn } = require('child_process');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting MarkFlow Development Environment...\n');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('   ⚠️  .env file not found');
    return false;
  }

  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=').replace(/^"|"$/g, '');
        }
      }
    });
  return true;
}

function checkPrismaClient() {
  const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
  if (!fs.existsSync(prismaClientPath)) {
    console.log('   Generating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated');
    } catch (error) {
      console.error('❌ Prisma client generation failed:', error.message);
      return false;
    }
  }
  return true;
}

async function main() {
  loadEnv();
  
  if (!checkPrismaClient()) {
    console.log('⚠️  Continuing anyway...');
  }

  console.log('');
  console.log('🚀 Starting Next.js development server...\n');

  const nextDev = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });

  nextDev.on('close', (code) => {
    console.log(`Next.js exited with code ${code}`);
    process.exit(code);
  });
}

main();