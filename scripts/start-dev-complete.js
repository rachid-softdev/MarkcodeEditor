#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Starting MarkFlow Complete Development Environment...\n');

let runningProcesses = [];

function checkPostgreSQL() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL client is available');
    return true;
  } catch {
    console.error('❌ PostgreSQL client is not installed');
    console.log('Please install PostgreSQL:');
    console.log('  • Windows: https://www.postgresql.org/download/windows/');
    console.log('  • macOS:   brew install postgresql');
    console.log('  • Linux:   sudo apt-get install postgresql');
    return false;
  }
}

function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'pipe' });
    console.log('✅ Docker is available');
    return true;
  } catch {
    console.log('⚠️  Docker not found');
    return false;
  }
}

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('   ⚠️  .env file not found, please create it with DATABASE_URL');
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

function setupDatabase() {
  try {
    console.log('🗄️  Setting up PostgreSQL database...');

    if (!loadEnv()) {
      console.log('⚠️  Skipping database setup - no .env file');
      return false;
    }

    const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
    if (!fs.existsSync(prismaClientPath)) {
      console.log('   Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
    } else {
      console.log('   Prisma client already exists, skipping generation');
    }

    console.log('   Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ PostgreSQL database setup complete');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL database setup failed:', error.message);
    console.log('\n💡 Make sure PostgreSQL is running:');
    console.log('   • PostgreSQL server installed and started');
    console.log('   • Database "markflow" exists');
    console.log('   • Credentials correct in .env');
    console.log('   • Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=markflow --name markflow-postgres postgres');
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
  console.log('📦 Starting PostgreSQL with Docker...');
  try {
    execSync('docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=markflow --name markflow-postgres postgres', { stdio: 'pipe' });
    console.log('✅ PostgreSQL container started');
    console.log('   → postgresql://postgres:postgres@localhost:5432/markflow');
    
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

function getPidOnPort(port) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port} "`, { stdio: 'pipe' }).toString();
    const lines = out.trim().split('\n').filter(l => l.includes('LISTENING'));
    if (!lines.length) return null;
    const parts = lines[0].trim().split(/\s+/);
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}

function tryExec(cmd, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve('timeout'), timeoutMs);
    try {
      execSync(cmd, { stdio: 'pipe', timeout: timeoutMs });
      clearTimeout(timer);
      resolve('ok');
    } catch {
      clearTimeout(timer);
      resolve('error');
    }
  });
}

async function killPort(port) {
  const platform = os.platform();

  if (platform !== 'win32') {
    await tryExec(`lsof -ti :${port} | xargs kill -9`);
    await new Promise(r => setTimeout(r, 1000));
    return;
  }

  const pid = getPidOnPort(port);
  if (!pid) return;

  console.log(`⚠️  Port ${port} occupied by PID ${pid} — killing it...`);

  await Promise.all([
    tryExec(`taskkill /PID ${pid} /F /T`),
    tryExec(`wmic process where ProcessId=${pid} delete`),
    tryExec(`powershell -Command "Stop-Process -Id ${pid} -Force -ErrorAction SilentlyContinue"`),
  ]);

  for (let i = 0; i < 8; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (!getPidOnPort(port)) {
      console.log(`✅ Port ${port} is now free`);
      return;
    }
  }

  await tryExec(
    `powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`
  );
  await new Promise(r => setTimeout(r, 1500));

  if (!getPidOnPort(port)) {
    console.log(`✅ Port ${port} is now free`);
  } else {
    console.log(`⚠️  Port ${port} could not be freed — Next.js may bind to a different port`);
  }
}

function cleanup() {
  console.log('\n🛑 Stopping all services...');

  runningProcesses.forEach((proc, i) => {
    try {
      if (proc && !proc.killed) {
        proc.kill('SIGTERM');
        console.log(`   Stopped process ${i + 1}`);
      }
    } catch {
      // ignore
    }
  });

  try {
    os.platform() === 'win32'
      ? execSync('taskkill /F /IM node.exe', { stdio: 'pipe' })
      : execSync('pkill -f "next dev"', { stdio: 'pipe' });
  } catch {
    // ignore
  }

  console.log('✅ All services stopped');
  process.exit(0);
}

async function main() {
  try {
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGHUP', cleanup);

    console.log('🔧 Setting up development environment...\n');

    // 1. PostgreSQL
    const hasPostgres = checkPostgreSQL();
    if (hasPostgres) {
      const isRunning = checkPostgresRunning();
      if (isRunning) {
        console.log('✅ PostgreSQL is already running');
      } else {
        const hasDocker = checkDocker();
        if (hasDocker) {
          startPostgresDocker();
        } else {
          console.log('⚠️  PostgreSQL not running and Docker not available');
          console.log('   Please start PostgreSQL manually or install Docker');
        }
      }
      if (!setupDatabase()) {
        console.log('⚠️  Database setup failed, but continuing...');
      }
    }
    console.log('');

    // 2. Free port 3000 if needed
    await killPort(3000);
    console.log('');

    // 3. Next.js
    console.log('🚀 Starting Next.js development server...\n');
    const nextDev = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });
    runningProcesses.push(nextDev);

    nextDev.on('close', (code) => {
      console.log(`Next.js exited with code ${code}`);
      cleanup();
    });

    console.log('');
    console.log('🌟 Development environment is ready!');
    console.log('');
    console.log('📊 Services:');
    console.log('   • PostgreSQL       → localhost:5432 (postgresql://postgres:postgres@localhost:5432/markflow)');
    console.log('   • Next.js          → http://localhost:3000');
    console.log('');
    console.log('💡 Useful commands:');
    console.log('   • npm run db:push   - Push schema changes');
    console.log('   • npm run db:studio - Open Prisma Studio');
    console.log('   • npm run db:reset  - Reset database (⚠️  deletes all data)');

  } catch (error) {
    console.error('❌ Failed to start development environment:', error.message);
    cleanup();
  }
}

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  cleanup();
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
  cleanup();
});

main();