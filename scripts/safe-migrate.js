const { execSync } = require('child_process');
const { createBackup } = require('./backup-db');

async function safeMigrate() {
    console.log('🔄 Starting safe migration process...\n');

    // Step 1: Create backup
    console.log('📦 Step 1: Creating database backup...');
    const backupPath = createBackup();

    if (!backupPath) {
        console.log('⚠️  Warning: No backup created (database might not exist yet)');
    }
    console.log('');

    // Step 2: Run migration
    console.log('🚀 Step 2: Running Prisma migration...');
    try {
        execSync('npx prisma migrate dev', { stdio: 'inherit' });
        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed!');
        if (backupPath) {
            console.log(`\n💾 You can restore from backup at: ${backupPath}`);
            console.log('To restore: npm run db:restore');
        }
        process.exit(1);
    }

    // Step 3: Generate Prisma Client
    console.log('\n🔨 Step 3: Generating Prisma Client...');
    try {
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('\n✅ Prisma Client generated!');
    } catch (error) {
        console.error('\n❌ Failed to generate Prisma Client');
        process.exit(1);
    }

    console.log('\n✨ All done! Database is ready to use.');
    console.log(`📁 Backup saved at: ${backupPath}`);
}

safeMigrate();
