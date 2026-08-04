export default {
    command: 'broadcast',
    aliases: ['bc', 'announce'],
    category: 'owner',
    description: 'Broadcast a message to all groups the bot is in',
    usage: '.broadcast <message>',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const channelInfo = context.channelInfo || {};
        const text = args.join(' ').trim();
        if (!text) {
            return await sock.sendMessage(chatId, {
                text: `*📢 BROADCAST*\n\n*Usage:* .broadcast <message>\n\n*Example:*\n.broadcast Hello everyone! Bot will be down for maintenance at 10 PM.\n\n_Sends to all groups the bot is in. Has a 1 second delay between each group to avoid ban._`,
                ...channelInfo
            }, { quoted: message });
        }
        let groups = [];
        try {
            const allChats = Object.keys(sock.store?.chats || {});
            groups = allChats.filter(jid => jid.endsWith('@g.us'));
        }
        catch (e) {
            console.error('[BROADCAST] Error getting groups:', e.message);
        }
        if (groups.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No groups found. Make sure the bot is in at least one group.',
                ...channelInfo
            }, { quoted: message });
        }
        await sock.sendMessage(chatId, {
            text: `📢 *Broadcasting to ${groups.length} group(s)...*\n\nThis may take a moment.`,
            ...channelInfo
        }, { quoted: message });
        const broadcastText = `📢 *BROADCAST MESSAGE*\n\n${text}`;
        let sent = 0;
        let failed = 0;
        for (const groupJid of groups) {
            try {
                await sock.sendMessage(groupJid, {
                    text: broadcastText,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363406588763460@newsletter',
                            newsletterName: 'ᴄʜʀɪs ɢᴀᴀᴊᴜ',
                            serverMessageId: -1
                        }
                    }
                });
                sent++;
            }
            catch (e) {
                console.error(`[BROADCAST] Failed to send to ${groupJid}: ${e.message}`);
                failed++;
            }
            // 1 second delay between sends to avoid WhatsApp rate limiting
            await new Promise(r => setTimeout(r, 1000));
        }
        await sock.sendMessage(chatId, {
            text: `✅ *Broadcast Complete!*\n\n📤 Sent: ${sent}\n❌ Failed: ${failed}\n📊 Total: ${groups.length}`,
            ...channelInfo
        }, { quoted: message });
    }
};
