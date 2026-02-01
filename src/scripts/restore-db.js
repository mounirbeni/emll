/* eslint-disable */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function restoreBackup() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined in environment variables');
        rl.close();
        return;
    }

    const backupDir = path.join(__dirname, '../../backups');

    if (!fs.existsSync(backupDir)) {
        console.log('❌ No backups directory found');
        rl.close();
        return;
    }

    const backups = fs.readdirSync(backupDir)
        .filter(f => f.endsWith('.dump'))
        .map(f => ({
            name: f,
            path: path.join(backupDir, f),
            time: fs.statSync(path.join(backupDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);

    if (backups.length === 0) {
        console.log('❌ No backups found');
        rl.close();
        return;
    }

    console.log('\n📦 Available backups:\n');
    backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name}`);
        console.log(`   Created: ${backup.time.toLocaleString()}\n`);
    });

    const answer = await question('Enter backup number to restore (or 0 to cancel): ');
    const choice = parseInt(answer);

    if (choice === 0 || isNaN(choice) || choice < 1 || choice > backups.length) {
        console.log('Cancelled');
        rl.close();
        return;
    }

    const selectedBackup = backups[choice - 1];
    const confirm = await question(`\n⚠️  This will OVERWRITE your current database. Continue? (yes/no): `);

    if (confirm.toLowerCase() !== 'yes') {
        console.log('Cancelled');
        rl.close();
        return;
    }

    console.log(`\n🔄 Restoring from ${selectedBackup.name}...`);

    try {
        // Use pg_restore
        // --clean: clean (drop) database objects before recreating them
        // --if-exists: used with --clean to avoid errors if objects don't exist
        // --no-owner: skip restoration of object ownership (useful if users differ)
        // --no-acl: skip restoration of access privileges (useful if users differ)
        execSync(`pg_restore --clean --if-exists --no-owner --no-acl -d "${databaseUrl}" "${selectedBackup.path}"`, { stdio: 'inherit' });

        console.log(`\n✅ Database restored successfully!`);
        console.log('\n⚠️  You may need to run: npx prisma migrate deploy');
    } catch (error) {
        console.error('\n❌ Restore failed:', error.message);
        console.error('Ensure pg_restore is installed and accessible in your PATH.');
    }

    rl.close();
}

restoreBackup();
