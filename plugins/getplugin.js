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
import fs from 'fs';
import path from 'path';
export default {
    command: 'inspect',
    aliases: ['cat', 'readcode', 'getplugin'],
    category: 'owner',
    description: 'Read the source code of a specific plugin',
    usage: '.inspect [plugin_name]',
    ownerOnly: true,
    async handler(sock, message, args, _context) {
        const chatId = message.key.remoteJid;
        const pluginName = args[0];
        if (!pluginName) {
            return await sock.sendMessage(chatId, { text: 'Which plugin do you want to inspect?\n\n*Examples:*\n- .inspect ping\n- .inspect ping.ts\n- .inspect ping.js' }, { quoted: message });
        }
        try {
            const base = pluginName.replace(/\.(ts|js)$/, '');
            let filePath;
            let fileName;
            if (pluginName.endsWith('.js')) {
                filePath = path.join(process.cwd(), 'plugins', `${base }.js`);
                fileName = `${base }.js`;
            }
            else {
                filePath = path.join(process.cwd(), 'plugins', `${base }.ts`);
                fileName = `${base }.ts`;
                if (!fs.existsSync(filePath)) {
                    filePath = path.join(process.cwd(), 'plugins', `${base }.js`);
                    fileName = `${base }.js`;
                }
            }
            if (!fs.existsSync(filePath)) {
                return await sock.sendMessage(chatId, { text: `❌ Plugin "${base}" not found.` }, { quoted: message });
            }
            const code = fs.readFileSync(filePath, 'utf8');
            const formattedCode = `💻 *SOURCE CODE: ${fileName}*\n\n\`\`\`javascript\n${code}\n\`\`\``;
            if (formattedCode.length > 4000) {
                await sock.sendMessage(chatId, {
                    document: Buffer.from(code),
                    fileName,
                    mimetype: 'text/javascript',
                    caption: `📄 Code for *${fileName}* (File too large for text message)`
                }, { quoted: message });
            }
            else {
                await sock.sendMessage(chatId, { text: formattedCode }, { quoted: message });
            }
        }
        catch (error) {
            console.error('Inspect Error:', error);
            await sock.sendMessage(chatId, { text: '❌ Failed to read the plugin file.' });
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