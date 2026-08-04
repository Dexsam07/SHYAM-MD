export default {
    command: 'broadcastdm',
    aliases: ['bcdm', 'announcedm', 'dmall'],
    category: 'owner',
    description: 'Broadcast a message to all saved DM contacts',
    usage: '.broadcastdm <message>',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const channelInfo = context.channelInfo || {};
        const text = args.join(' ').trim();
        if (!text) {
            return await sock.sendMessage(chatId, {
                text: `*📩 BROADCAST DM*\n\n*Usage:* .broadcastdm <message>\n\n*Example:*\n.broadcastdm Hey! Check out our new features!\n\n_Sends to all contacts in the bot's contact list. Has a 1.5s delay between each to avoid ban._`,
                ...channelInfo
            }, { quoted: message });
        }
        let contacts = [];
        try {
            const allContacts = Object.keys(sock.store?.contacts || {});
            contacts = allContacts.filter(jid => jid.endsWith('@s.whatsapp.net') &&
                jid !== sock.user?.id);
        }
        catch (e) {
            console.error('[BROADCASTDM] Error getting contacts:', e.message);
        }
        if (contacts.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ No contacts found in the bot\'s contact list.',
                ...channelInfo
            }, { quoted: message });
        }
        await sock.sendMessage(chatId, {
            text: `📩 *Broadcasting to ${contacts.length} contact(s)...*\n\nThis may take a moment.`,
            ...channelInfo
        }, { quoted: message });
        const broadcastText = `📩 *MESSAGE*\n\n${text}`;
        let sent = 0;
        let failed = 0;
        for (const contactJid of contacts) {
            try {
                await sock.sendMessage(contactJid, {
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
                console.error(`[BROADCASTDM] Failed to send to ${contactJid}: ${e.message}`);
                failed++;
            }
            // 1.5 second delay between DMs
            await new Promise(r => setTimeout(r, 1500));
        }
        await sock.sendMessage(chatId, {
            text: `✅ *DM Broadcast Complete!*\n\n📤 Sent: ${sent}\n❌ Failed: ${failed}\n📊 Total: ${contacts.length}`,
            ...channelInfo
        }, { quoted: message });
    }
};
