/*****************************************************************************
 *                                                                           *
 *                     Developed By dexsam07                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/dexsam07                         *
 *  ▶️  YouTube  : https://youtube.com/@dex_shyam_tech                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbBgXTsKwqSKZKy38w2o     *
 *                                                                           *
 *    © 2026 dexsam07. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the SHYAM-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
import CommandHandler from '../lib/commandHandler.js';
export default {
    command: 'perf',
    aliases: ['metrics', 'diagnostics'],
    category: 'general',
    description: 'View command performance and error metrics',
    usage: '.perf',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        try {
            const report = CommandHandler.getDiagnostics();
            if (!report || report.length === 0) {
                return await sock.sendMessage(chatId, { text: '_No performance data collected yet._' }, { quoted: message });
            }
            let text = `📊 *PLUGINS PERFORMANCE*\n\n`;
            report.forEach((cmd, index) => {
                const errorText = cmd.errors > 0 ? `❗ Errors: ${cmd.errors}` : `✅ Smooth`;
                text += `${index + 1}. *${cmd.command.toUpperCase()}*\n`;
                text += `   ↳ Calls: ${cmd.usage}\n`;
                text += `   ↳ Latency: ${cmd.average_speed}\n`;
                text += `   ↳ Status: ${errorText}\n\n`;
            });
            await sock.sendMessage(chatId, {
                text: text.trim(),
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363406449026172@newsletter',
                        newsletterName: '🇮🇳 DEX SHYAM TECH 𓋜',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }
        catch (error) {
            console.error('Error in perf command:', error);
            await sock.sendMessage(chatId, { text: '❌ Failed to fetch performance metrics.' }, { quoted: message });
        }
    }
};
/*****************************************************************************
 *                                                                           *
 *                     Developed By dexsam07                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/dexsam07                         *
 *  ▶️  YouTube  : https://youtube.com/@dex_shyam_tech                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbBgXTsKwqSKZKy38w2o     *
 *                                                                           *
 *    © 2026 dexsam07. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the SHYAM-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/