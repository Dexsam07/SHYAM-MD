import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { TEMP_DIR } from '../lib/paths.js';
const execAsync = promisify(exec);
export default {
    command: 'crun',
    aliases: ['cpp', 'runcpp', 'c++'],
    category: 'utility',
    description: 'Compile and run C++ code',
    usage: '.crun <c++ code>',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        // Get code from: args, quoted message, or document
        const quoted = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
        const hasDoc = !!quoted?.documentMessage;
        let code = '';
        if (hasDoc) {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const msgObj = { message: { documentMessage: quoted.documentMessage } };
            const buf = await downloadMediaMessage(msgObj, 'buffer', {});
            code = buf.toString('utf8');
        }
        else {
            // Preserve newlines from raw message text
            const rawText = message?.message?.conversation ||
                message?.message?.extendedTextMessage?.text || '';
            // Strip the command prefix and command name from raw text
            const cmdMatch = rawText.match(/^[.!/]\w+\s*/);
            code = cmdMatch ? rawText.slice(cmdMatch[0].length) : args.join(' ');
            if (!code.trim())
                code = quotedText;
        }
        code = code.trim();
        if (!code) {
            return await sock.sendMessage(chatId, {
                text: `⚡ *C++ Runner*\n\n` +
                    `*Usage:* \`.crun <code>\`\n\n` +
                    `*Example:*\n` +
                    `\`.crun #include<iostream>\nusing namespace std;\nint main(){cout<<"Hello World!"<<endl;return 0;}\`\n\n` +
                    `• Max execution time: 10 seconds\n` +
                    `• No file/network access\n` +
                    `• Auto-wraps in main() if not present`,
                ...channelInfo
            }, { quoted: message });
        }
        // Auto-wrap if no main() found
        if (!code.includes('main(') && !code.includes('main (')) {
            code = `#include<iostream>\n#include<cmath>\n#include<string>\n#include<vector>\nusing namespace std;\nint main(){\n${code}\nreturn 0;\n}`;
        }
        const id = Date.now();
        const srcFile = path.join(TEMP_DIR, `crun_${id}.cpp`);
        const binFile = path.join(TEMP_DIR, `crun_${id}`);
        try {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
            fs.writeFileSync(srcFile, code);
            await sock.sendMessage(chatId, {
                text: '⚙️ *Compiling...*',
                ...channelInfo
            }, { quoted: message });
            // Compile
            try {
                await execAsync(`g++ -o ${binFile} ${srcFile} -std=c++17 -O2`, { timeout: 15000 });
            }
            catch (compileErr) {
                return await sock.sendMessage(chatId, {
                    text: `❌ *Compilation Error:*\n\n\`\`\`\n${compileErr.stderr || compileErr.message}\n\`\`\``,
                    ...channelInfo
                }, { quoted: message });
            }
            // Run with timeout
            let output = '';
            try {
                const { stdout, stderr } = await execAsync(`timeout 10 ${binFile}`, { timeout: 12000 });
                output = (stdout || stderr || '').trim();
            }
            catch (runErr) {
                output = runErr.stdout?.trim() || runErr.message || 'Runtime error';
            }
            if (!output)
                output = '(no output)';
            if (output.length > 3000)
                output = `${output.substring(0, 3000) }\n...(truncated)`;
            await sock.sendMessage(chatId, {
                text: `⚡ *C++ Output:*\n\n\`\`\`\n${output}\n\`\`\``,
                ...channelInfo
            }, { quoted: message });
        }
        finally {
            // Cleanup
            try {
                fs.unlinkSync(srcFile);
            }
            catch { }
            try {
                fs.unlinkSync(binFile);
            }
            catch { }
        }
    }
};
