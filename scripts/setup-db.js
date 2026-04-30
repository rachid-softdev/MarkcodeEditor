#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🗄️  MarkFlow Database Setup\n');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    console.log('   Please create .env with DATABASE_URL');
    console.log('   Example: postgresql://postgres:postgres@localhost:5432/markflow');
    process.exit(1);
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
}

function checkPostgres() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkPostgresRunning() {
  try {
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/markflow';
    execSync(`psql "${dbUrl}" -c "SELECT 1"`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function startPostgresDocker() {
  console.log('📦 Starting PostgreSQL container with Docker...');
  try {
    execSync('docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=markflow --name markflow-postgres postgres', { stdio: 'pipe' });
    console.log('✅ PostgreSQL container started');
    
    console.log('   Waiting for PostgreSQL to be ready...');
    let attempts = 0;
    while (attempts < 30) {
      try {
        execSync('sleep 2');
        execSync('docker exec markflow-postgres pg_isready', { stdio: 'pipe' });
        console.log('✅ PostgreSQL is ready');
        return true;
      } catch {
        attempts++;
      }
    }
    console.log('⚠️  PostgreSQL may not be ready yet');
    return true;
  } catch (error) {
    console.error('❌ Failed to start PostgreSQL:', error.message);
    return false;
  }
}

function generatePrismaClient() {
  console.log('   Generating Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.error('❌ Prisma client generation failed');
    return false;
  }
  return true;
}

function pushSchema() {
  console.log('   Pushing schema to database...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed');
  } catch (error) {
    console.error('❌ Database push failed');
    return false;
  }
  return true;
}

async function main() {
  loadEnv();

  console.log('Checking PostgreSQL installation...\n');
  
  const hasPostgres = checkPostgres();
  const hasDocker = checkDocker();

  if (!hasPostgres && !hasDocker) {
    console.log('❌ PostgreSQL is not installed and Docker is not available');
    console.log('\nPlease install one of the following:');
    console.log('  • PostgreSQL: https://www.postgresql.org/download/');
    console.log('  • Docker: https://www.docker.com/products/docker-desktop');
    process.exit(1);
  }

  let postgresRunning = false;

  if (hasPostgres) {
    postgresRunning = checkPostgresRunning();
  }

  if (!postgresRunning && hasDocker) {
    startPostgresDocker();
    postgresRunning = true;
  }

  if (!postgresRunning) {
    console.log('❌ PostgreSQL is not running');
    console.log('\nPlease start PostgreSQL and try again');
    process.exit(1);
  }

  console.log('\nDatabase configuration:');
  console.log(`   URL: ${process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/markflow'}`);
  console.log('');

  if (!generatePrismaClient()) {
    process.exit(1);
  }

  if (!pushSchema()) {
    process.exit(1);
  }

  console.log('\n✅ Database setup complete!');
  console.log('\n💡 Next steps:');
  console.log('   • npm run dev          - Start development server');
  console.log('   • npm run db:studio    - Open Prisma Studio');
  console.log('   • npm run db:reset     - Reset database (⚠️  deletes all data)');
}

main();