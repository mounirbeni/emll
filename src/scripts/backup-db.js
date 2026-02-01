/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function createBackup() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not defined in environment variables');
        return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../backups');

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, `backup-${timestamp}.dump`);

    // Check if pg_dump is available
    try {
        execSync('pg_dump --version', { stdio: 'ignore' });
    } catch (e) {
        console.warn('⚠️  pg_dump not found. Skipping backup.');
        return null;
    }

    console.log('📦 Creating PostgreSQL backup...');

    try {
        // Use pg_dump with custom format (-F c) for better portability and compression
        execSync(`pg_dump "${databaseUrl}" -F c -f "${backupPath}"`, { stdio: 'inherit' });

        console.log(`✅ Database backed up to: ${backupPath}`);

        // Keep only last 10 backups
        const backups = fs.readdirSync(backupDir)
            .filter(f => f.endsWith('.dump'))
            .map(f => ({
                name: f,
                path: path.join(backupDir, f),
                time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > 10) {
            backups.slice(10).forEach(backup => {
                fs.unlinkSync(backup.path);
                console.log(`🗑️  Removed old backup: ${backup.name}`);
            });
        }

        return backupPath;
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        console.error('Ensure pg_dump is installed and accessible in your PATH.');
        return null;
    }
}

module.exports = { createBackup };

// Run directly
if (require.main === module) {
    createBackup();
}
