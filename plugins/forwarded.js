/*****************************************************************************
 *                                                                           *
 *                     Developed By Chris Gaaju                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/Xchristech2                         *
 *  ▶️  YouTube  : https://youtube.com/@Xchristech                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z     *
 *                                                                           *
 *    © 2026 Xchristech2. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the GAAJU-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
export default {
    command: 'forwarded',
    aliases: ['viral', 'fakeforward'],
    category: 'tools',
    description: 'Send text with a fake "Frequently Forwarded" tag',
    usage: '.viral <text> OR reply to a message',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        try {
            let txt = "";
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quoted) {
                txt = quoted.conversation ||
                    quoted.extendedTextMessage?.text ||
                    quoted.imageMessage?.caption ||
                    quoted.videoMessage?.caption ||
                    "";
            }
            if (!txt || txt.trim() === "") {
                txt = args?.join(' ') || "";
            }
            if (!txt || txt.trim() === "") {
                return await sock.sendMessage(chatId, {
                    text: 'Please provide text or reply to a message to forward.'
                }, { quoted: message });
            }
            await sock.sendMessage(chatId, {
                text: txt,
                contextInfo: {
                    isForwarded: true,
                    forwardingScore: 999
                }
            });
        }
        catch (err) {
            console.error('Forwarding Spoof Error:', err);
            await sock.sendMessage(chatId, { text: '❌ Failed to spoof forwarding.' });
        }
    }
};
/*****************************************************************************
 *                                                                           *
 *                     Developed By Chris Gaaju                                *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/Xchristech2                         *
 *  ▶️  YouTube  : https://youtube.com/@Xchristech                       *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VbBvGgyFsn0alyIDjw0z     *
 *                                                                           *
 *    © 2026 Xchristech2. All rights reserved.                            *
 *                                                                           *
 *    Description: This file is part of the GAAJU-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/
