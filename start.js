const { execSync } = require('child_process');
const { Pool } = require('pg');

const dbConfig = {
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'requests_db',
  password: process.env.POSTGRES_PASSWORD || 'admin123',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
};

async function waitForDatabase(maxRetries = 30, delayMs = 1000) {
  const pool = new Pool(dbConfig);

  for (let i = 1; i <= maxRetries; i += 1) {
    try {
      await pool.query('SELECT 1');
      await pool.end();
      console.log('Database is ready.');
      return;
    } catch (error) {
      console.log(`Waiting for database... (${i}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  await pool.end();
  throw new Error('Database connection timeout.');
}

async function bootstrap() {
  try {
    console.log('Starting bootstrap...');
    await waitForDatabase();

    console.log('Running migrations...');
    execSync('npm run migrate:up', { stdio: 'inherit', env: process.env });
    console.log('Migrations finished.');

    console.log('Starting application...');
    require('./server');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();
