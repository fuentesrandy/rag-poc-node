import { execSync } from 'child_process';

const timestamp = new Date().getTime();
const migrationName = `migration_${timestamp}`;
const command = `npm run migration:generate src/modules/core/database/migrations/${migrationName}`;

console.log(`Creating migration: ${migrationName}`);
execSync(command, { stdio: 'inherit' }); 