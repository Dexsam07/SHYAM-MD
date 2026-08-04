import { getBin } from '../lib/compile.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
export default {
    command: 'cipher',
    aliases: ['encrypt', 'decrypt', 'encode', 'crypt'],
    category: 'utility',
    description: 'Encrypt or decrypt text using Caesar, Vigenere, or XOR cipher',
    usage: '.cipher <type> <encode|decode> <key> <text>',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        if (args.length < 4) {
            return await sock.sendMessage(chatId, {
                text: `🔐 *Text Cipher*\n\n` +
                    `*Usage:* \`.cipher <type> <encode|decode> <key> <text>\`\n\n` +
                    `*Cipher types:*\n\n` +
                    `*caesar* — shift letters by a number (key = number)\n` +
                    `• \`.cipher caesar encode 13 Hello World\`\n` +
                    `• \`.cipher caesar decode 13 Uryyb Jbeyq\`\n\n` +
                    `*vigenere* — polyalphabetic cipher (key = word)\n` +
                    `• \`.cipher vigenere encode SECRET Hello World\`\n` +
                    `• \`.cipher vigenere decode SECRET Zincs Pgvnu\`\n\n` +
                    `*xor* — XOR byte cipher, output is hex (key = any text)\n` +
                    `• \`.cipher xor encode mykey Hello\`\n` +
                    `• \`.cipher xor decode mykey 25090a0e06\``,
                ...channelInfo
            }, { quoted: message });
        }
        const cipherType = args[0].toLowerCase();
        const mode = args[1].toLowerCase();
        const key = args[2];
        const text = args.slice(3).join(' ').trim();
        if (!['caesar', 'vigenere', 'xor'].includes(cipherType)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Unknown cipher: *${cipherType}*\nUse: \`caesar\`, \`vigenere\`, or \`xor\``,
                ...channelInfo
            }, { quoted: message });
        }
        if (!['encode', 'decode', 'encrypt', 'decrypt'].includes(mode)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Unknown mode: *${mode}*\nUse: \`encode\` or \`decode\``,
                ...channelInfo
            }, { quoted: message });
        }
        if (!text) {
            return await sock.sendMessage(chatId, {
                text: `❌ No text provided.`,
                ...channelInfo
            }, { quoted: message });
        }
        if (cipherType === 'caesar' && isNaN(parseInt(key, 10))) {
            return await sock.sendMessage(chatId, {
                text: `❌ Caesar cipher key must be a number (e.g. 13)`,
                ...channelInfo
            }, { quoted: message });
        }
        try {
            const bin = getBin('cipher');
            const safeText = text.replace(/"/g, '\\"');
            const safeKey = key.replace(/"/g, '\\"');
            const { stdout, stderr } = await execAsync(`"${bin}" ${cipherType} ${mode} "${safeKey}" "${safeText}"`, { timeout: 10000 });
            if (stderr && !stdout) {
                return await sock.sendMessage(chatId, {
                    text: `❌ ${stderr.trim()}`,
                    ...channelInfo
                }, { quoted: message });
            }
            const result = stdout.trim();
            const cipherNames = {
                caesar: 'Caesar', vigenere: 'Vigenère', xor: 'XOR'
            };
            const modeLabel = (mode === 'encode' || mode === 'encrypt') ? '🔒 Encrypted' : '🔓 Decrypted';
            await sock.sendMessage(chatId, {
                text: `🔐 *${cipherNames[cipherType]} Cipher*\n\n` +
                    `📥 *Input:* \`${text}\`\n` +
                    `🔑 *Key:* \`${key}\`\n` +
                    `${modeLabel}: \`${result}\``,
                ...channelInfo
            }, { quoted: message });
        }
        catch (error) {
            await sock.sendMessage(chatId, {
                text: `❌ Failed: ${error.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    }
};
