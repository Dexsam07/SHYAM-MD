'use strict';

const path = require('path');
const fs   = require('fs');
const cfg  = require("../../config");
const { getBotName } = require("../../lib/botname");

// ── get version from package.json ──
let BOT_VERSION = 'v1.2.0';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    if (pkg.version) BOT_VERSION = `v${pkg.version}`;
} catch {}

// ── platform detection (same as menu) ──
function getPlatform() {
    if (process.env.DYNO) return 'Heroku';
    if (process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.RENDER) return 'Render';
    return 'VPS';
}

module.exports = {
    name: "alive",
    aliases: ["awake", "status", "online"],
    description: "Check if the bot is alive and running",
    category: "utility",

    async execute(sock, msg, args, prefix) {
        const chatId = msg.key.remoteJid;

        // ── send reaction ──
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: "🪀",
                    key: msg.key
                }
            });
        } catch {}

        const botName = getBotName();
        const p = prefix || cfg.PREFIX || '.';

        // ── uptime ──
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);

        const owner = cfg.OWNER_NUMBER
            ? `+${cfg.OWNER_NUMBER}`
            : (cfg.OWNER_NAME || 'Unknown');

        const mode = (cfg.MODE || 'public').toUpperCase();

        // ── build the hacker box ──
        const BOX_WIDTH = 40;
        const topBorder = '━'.repeat(BOX_WIDTH);
        const bottomBorder = '╰' + '━'.repeat(BOX_WIDTH - 1);
        const lines = [];

        lines.push(topBorder);
        lines.push(`┃ 🪀 ${botName} 🪀`);
        lines.push(bottomBorder);

        lines.push(`┃ 🛸 Prefix : [${p}]`);
        lines.push(`┃ 🧑‍💻 Owner  : ${owner}`);
        lines.push(`┃ 🔐 Mode   : ${mode}`);
        lines.push(`┃ ✅ Status : ONLINE`);
        lines.push(`┃ ⏰ Uptime : ${h}h ${m}m ${s}s`);
        lines.push(`┃ 💻 Platform: ${getPlatform()}`);
        lines.push(`┃ 📦 Version : ${BOT_VERSION}`);
        lines.push('─'.repeat(BOX_WIDTH));
        lines.push(`┃ 🚀 Powered by 🇮🇳 DEX SHYAM TECH`);
        lines.push(bottomBorder);

        const text = lines.join('\n');

        await sock.sendMessage(
            chatId,
            { text },
            { quoted: msg }
        );
    }
};