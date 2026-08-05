'use strict';

const path = require('path');
const fs   = require('fs');
const cfg  = require("../../config");
const { getBotName } = require("../../lib/botname");

// ── version & platform ──
let BOT_VERSION = 'v1.2.0';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    if (pkg.version) BOT_VERSION = `v${pkg.version}`;
} catch {}

function getPlatform() {
    if (process.env.DYNO) return 'Heroku';
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.RENDER) return 'Render';
    return 'VPS';
}

module.exports = {
    name: 'uptime',
    aliases: ['up', 'runtime'],
    description: 'Show how long the bot has been running',
    category: 'utility',

    async execute(sock, msg, args, prefix, ctx) {
        const chatId = msg.key.remoteJid;

        // ── reaction ──
        try {
            await sock.sendMessage(chatId, {
                react: { text: "⏱️", key: msg.key }
            });
        } catch {}

        // ── uptime calculation ──
        const uptimeSeconds = process.uptime();
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        // ── build readable time string ──
        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);
        const timeStr = parts.join(' ');

        // ── taunt based on uptime ──
        let taunt;
        if (uptimeSeconds < 60) {
            taunt = "🆕 Abhi toh janam liya hai!";
        } else if (uptimeSeconds < 3600) {
            taunt = "⏳ Bas shuru kiya hai, abhi toh party baaki hai!";
        } else if (uptimeSeconds < 86400) {
            taunt = "💪 Ek din bhi nahi hua, full power mode!";
        } else if (uptimeSeconds < 604800) { // 7 days
            taunt = "🔥 Itna time se chal raha hai, teri umar se zyada?";
        } else {
            taunt = "💀Teri Ex ki Behenchod, itne din se ON hai! Server ko rest de de!";
        }

        // ── build box ──
        const BOX_WIDTH = 44;
        const topBorder = '━'.repeat(BOX_WIDTH);
        const bottomBorder = '╰' + '━'.repeat(BOX_WIDTH - 1);
        const lines = [];

        lines.push(topBorder);
        lines.push(`┃ ⏰ **UPTIME**  ⏰`);
        lines.push(bottomBorder);

        lines.push(`┃ 🕒 Runtime : ${timeStr}`);
        lines.push(`┃ 💀 ${taunt}`);
        lines.push('─'.repeat(BOX_WIDTH));
        lines.push(`┃ 💻 Platform : ${getPlatform()}`);
        lines.push(`┃ 📦 Version  : ${BOT_VERSION}`);
        lines.push('─'.repeat(BOX_WIDTH));
        lines.push(`┃ 🚀 Powered by 🪀 DEX SHYAM TECH`);
        lines.push(bottomBorder);

        const text = lines.join('\n');

        await sock.sendMessage(
            chatId,
            { text },
            { quoted: msg }
        );
    },
};