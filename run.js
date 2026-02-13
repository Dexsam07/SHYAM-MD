// secret/run.js
// This file decodes ONLY the specified obfuscated files (base64 → plain JS/JSON)
// It should be called ONE TIME after git clone & before starting the bot

const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────
//               FILES TO DECODE
// Add/remove file names here if needed in future
// ────────────────────────────────────────────────
const filesToDecode = [
    'app.json',
    'config.js',
    'settings.js'
];

// ────────────────────────────────────────────────
//               MAIN DECODE FUNCTION
// ────────────────────────────────────────────────
function decodeAndReplace(filePath) {
    try {
        // Read the current (probably base64) content
        const content = fs.readFileSync(filePath, 'utf8').trim();

        // Very common patterns people use to hide code:
        // 1. Pure base64 string
        // 2. eval(atob("base64here"))
        // 3. eval(Buffer.from("base64here", "base64").toString())

        let decoded = null;

        // Case 1: file contains pure base64 (no extra text)
        if (/^[A-Za-z0-9+/=]+$/.test(content)) {
            decoded = Buffer.from(content, 'base64').toString('utf8');
        }
        // Case 2: eval(atob("...."))
        else if (content.includes('atob(')) {
            const match = content.match(/atob\(["']([^"']+)["']\)/);
            if (match && match[1]) {
                decoded = Buffer.from(match[1], 'base64').toString('utf8');
            }
        }
        // Case 3: eval(Buffer.from(...., 'base64').toString())
        else if (content.includes('Buffer.from') && content.includes("'base64'")) {
            const match = content.match(/Buffer\.from\(["']([^"']+)["'],\s*["']base64["']\)/);
            if (match && match[1]) {
                decoded = Buffer.from(match[1], 'base64').toString('utf8');
            }
        }

        if (!decoded) {
            console.log(`[DECODE] Could not recognize format in ${filePath} → skipping`);
            return;
        }

        // Write decoded content back to the same file (overwrite)
        fs.writeFileSync(filePath, decoded, 'utf8');
        console.log(`[DECODE] Successfully decoded & replaced → ${filePath}`);

    } catch (err) {
        console.error(`[DECODE] Error processing ${filePath}:`, err.message);
    }
}

// ────────────────────────────────────────────────
//               RUN FOR ALL FILES
// ────────────────────────────────────────────────
console.log('[DECODE] Starting decode process...');

filesToDecode.forEach((relativePath) => {
    const fullPath = path.resolve(process.cwd(), relativePath);

    if (fs.existsSync(fullPath)) {
        decodeAndReplace(fullPath);
    } else {
        console.log(`[DECODE] File not found → ${relativePath} (skipping)`);
    }
});

console.log('[DECODE] All files processed.');
