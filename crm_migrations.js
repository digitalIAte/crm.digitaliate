const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Abdel/Antigravity/n8n-antigravity/dashboard/src/app/crm';
const destDir = 'C:/Abdel/Antigravity/n8n-antigravity/dashboard-payboys/src/app/crm';

function copyDirRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    for (const file of files) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        // Skip the 'login' directory completely
        if (file === 'login' && fs.statSync(srcPath).isDirectory()) {
            continue;
        }

        if (fs.statSync(srcPath).isDirectory()) {
            copyDirRecursiveSync(srcPath, destPath);
        } else {
            // Read content, replace 'digitaliate' with 'payboys', replace logos
            let content = fs.readFileSync(srcPath, 'utf8');

            // Branding replacements
            content = content.replace(/digitaliate/g, 'payboys');
            content = content.replace(/Digitaliate/g, 'Payboys');
            content = content.replace(/DigitalIAte/g, 'Payboys');
            content = content.replace(/logo_digitaliate\.png/g, 'logo_payboys.png');
            // Edge case for ClientLayout vs Layout separation in Payboys
            // The Next.js 14 layout architecture might differ, but overwriting should generally work if we overwrite both layout.tsx and page.tsx.

            fs.writeFileSync(destPath, content);
            console.log(`Copied and adapted: ${destPath}`);
        }
    }
}

console.log('Starting migration...');
// Clean destination recursively except login
function cleanDest(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'login') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(fullPath);
        }
    }
}

cleanDest(destDir);
console.log('Cleaned destination (kept login)');

copyDirRecursiveSync(srcDir, destDir);
console.log('Migration complete!');
