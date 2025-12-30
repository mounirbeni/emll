/**
 * Email Configuration Verification Script
 * Checks if all required environment variables and packages are configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Email Configuration...\n');

// Check .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
        // Skip empty lines and comments
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present (handles both single and double quotes)
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            // Handle multi-line values (though we shouldn't have any)
            envVars[key] = value;
        }
    });
    
    console.log('✅ .env.local file found\n');
} else {
    console.log('❌ .env.local file not found\n');
    process.exit(1);
}

// Check required environment variables
console.log('📋 Environment Variables:');
const requiredVars = {
    'RESEND_API_KEY': 'Resend API Key',
    'RESEND_FROM_EMAIL': 'Resend From Email',
    'DATABASE_URL': 'Database URL'
};

let allPresent = true;
Object.keys(requiredVars).forEach(key => {
    if (envVars[key]) {
        const displayValue = key === 'RESEND_API_KEY' 
            ? `${envVars[key].substring(0, 10)}...` 
            : key === 'DATABASE_URL'
            ? `${envVars[key].substring(0, 30)}...`
            : envVars[key];
        console.log(`  ✅ ${requiredVars[key]}: ${displayValue}`);
    } else {
        console.log(`  ❌ ${requiredVars[key]}: NOT SET`);
        allPresent = false;
    }
});

// Check package.json for required packages
console.log('\n📦 Installed Packages:');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredPackages = {
        'resend': 'Resend SDK',
        '@react-email/components': 'React Email Components',
        'react-email': 'React Email (dev)',
        '@react-email/preview-server': 'React Email Preview (dev)'
    };
    
    Object.keys(requiredPackages).forEach(pkg => {
        if (allDeps[pkg]) {
            console.log(`  ✅ ${requiredPackages[pkg]}: ${allDeps[pkg]}`);
        } else {
            console.log(`  ❌ ${requiredPackages[pkg]}: NOT INSTALLED`);
            allPresent = false;
        }
    });
} else {
    console.log('  ❌ package.json not found');
    allPresent = false;
}

// Validate RESEND_API_KEY format
console.log('\n🔑 API Key Validation:');
if (envVars.RESEND_API_KEY) {
    if (envVars.RESEND_API_KEY.startsWith('re_')) {
        console.log('  ✅ API Key format is valid (starts with re_)');
    } else {
        console.log('  ⚠️  API Key format may be invalid (should start with re_)');
    }
    
    if (envVars.RESEND_API_KEY.length >= 20) {
        console.log('  ✅ API Key length is valid');
    } else {
        console.log('  ⚠️  API Key seems too short');
    }
} else {
    console.log('  ❌ No API Key to validate');
}

// Validate RESEND_FROM_EMAIL format
console.log('\n📧 From Email Validation:');
if (envVars.RESEND_FROM_EMAIL) {
    const emailMatch = envVars.RESEND_FROM_EMAIL.match(/<(.+)>/);
    if (emailMatch) {
        const email = emailMatch[1];
        if (email.includes('@')) {
            console.log(`  ✅ From Email format is valid: ${email}`);
        } else {
            console.log('  ⚠️  From Email format may be invalid');
        }
    } else {
        console.log('  ⚠️  From Email should be in format: "Name <email@domain.com>"');
    }
} else {
    console.log('  ❌ No From Email to validate');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allPresent) {
    console.log('✅ Configuration looks good!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Make sure your Next.js server is restarted');
    console.log('  2. Test the email service at: /admin/test-email');
    console.log('  3. Or use the API endpoint: /api/test-email-simple');
} else {
    console.log('❌ Configuration is incomplete');
    console.log('\n⚠️  Please fix the issues above before proceeding');
    process.exit(1);
}

