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

function getUptime() {
    const s = Math.floor(process.uptime());
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
}

module.exports = {
    name: 'ping',
    aliases: ['p', 'speed', 'latency'],
    description: 'Check bot response time',
    category: 'utility',

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const start = Date.now();

        // ── temp message ──
        const sent = await sock.sendMessage(chatId, {
            text: "⏳ *Ping ho raha hai...*"
        }, { quoted: msg });

        const latency = Date.now() - start;

        // ── bomb reaction ──
        try {
            await sock.sendMessage(chatId, {
                react: { text: "🧨", key: msg.key }
            });
        } catch {}

        // ── GAALI + TAUNT based on latency ──
        let gaali;
        if (latency < 100) {
            gaali = "🏃‍♂️ **Bhenchod, itna fast hai!** Tere Ex ki baap ne seedha fiber lagwaya kya? 😂";
        } else if (latency < 200) {
            gaali = "⚡ **Thik hai, behen ke lode Ex !** Koi tension nahi, chill kar. 😎";
        } else if (latency < 400) {
            gaali = "🐌 **Oye slow-mo!** Teri Ex ki maa ko chudail network, thoda upgrade kar. 😤";
        } else if (latency < 800) {
            gaali = "💀 **Behenchod, itna slow!** Server teri Ex ki bahan ke saath chakkar kha raha hai? 😈";
        } else {
            gaali = "🔥 **Teri Ex ki maa ki aankh!** Ye to dead hai. Ab tu khud hi ping karle. 🖕";
        }

        // ── box building ──
        const BOX_WIDTH = 44;
        const topBorder = '━'.repeat(BOX_WIDTH);
        const bottomBorder = '╰' + '━'.repeat(BOX_WIDTH - 1);
        const lines = [];

        // HEADER – symbol + "TERI MAA KI"
        lines.push(topBorder);
        lines.push(`┃ 💀 （ ͜.人 ͜.）𓀐𓂺  **TERI EX KI MAA KO**  💀`);
        lines.push(bottomBorder);

        lines.push(`┃ ⚡ Latency : ${latency} ms`);
        lines.push(`┃ ${gaali}`);
        lines.push('─'.repeat(BOX_WIDTH));
        lines.push(`┃ 💻 Platform : ${getPlatform()}`);
        lines.push(`┃ ⏰ Uptime   : ${getUptime()}`);
        lines.push(`┃ 📦 Version  : ${BOT_VERSION}`);
        lines.push('─'.repeat(BOX_WIDTH));
        lines.push(`┃ 🖕 **Ab jaake apni ex ki maa ko bata ki ping aayi hai.**`);
        lines.push(`┃ 🤖 Powered by 🪀 DEX SHYAM TECH `);
        lines.push(bottomBorder);

        const finalText = lines.join('\n');

        // ── edit the message ──
        await sock.sendMessage(chatId, {
            text: finalText,
            edit: sent.key
        });
    },
};