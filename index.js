/* process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; */

require('./config');
require('./settings');

const { Boom } = require('@hapi/boom');
const fs = require('fs');
const chalk = require('chalk');
const FileType = require('file-type');
const syntaxerror = require('syntax-error');
const path = require('path');
const axios = require('axios');
const PhoneNumber = require('awesome-phonenumber');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    Browsers,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");
const { parsePhoneNumber } = require("libphonenumber-js");
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics');
const { rmSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const store = require('./lib/lightweight_store');
const SaveCreds = require('./lib/session');
const { app, server, PORT } = require('./lib/server');
const { printLog } = require('./lib/print');
const { 
    handleMessages, 
    handleGroupParticipantUpdate, 
    handleStatus,
    handleCall 
} = require('./lib/messageHandler');

const settings = require('./settings');
const commandHandler = require('./lib/commandHandler');

store.readFromFile();
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000);

commandHandler.loadCommands();
// console.log(chalk.greenBright(`✅ Loaded ${commandHandler.commands.size} Plugins`));

setInterval(() => {
    if (global.gc) {
        global.gc();
        console.log('🧹 Garbage collection completed');
    }
}, 60_000);

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024;
    if (used > 400) {
        console.log(chalk.yellow('⚠️ RAM too high (>400MB), restarting bot...'));
        process.exit(1);
    }
}, 30_000);

let phoneNumber = global.PAIRING_NUMBER || process.env.PAIRING_NUMBER || "923051391005";
let owner = JSON.parse(fs.readFileSync('./data/owner.json'));

global.botname = process.env.BOT_NAME || "SHYAM-MD";
global.themeemoji = "•";

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");

let rl = null;
if (process.stdin.isTTY && !process.env.PAIRING_NUMBER) {
    rl = readline.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    });
}

const question = (text) => {
    if (rl && !rl.closed) {
        return new Promise((resolve) => rl.question(text, resolve));
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber);
    }
};

process.on('exit', () => {
    if (rl && !rl.closed) {
        rl.close();
    }
});

process.on('SIGINT', () => {
    if (rl && !rl.closed) {
        rl.close();
    }
    process.exit(0);
});

function ensureSessionDirectory() {
    const sessionPath = path.join(__dirname, 'session');
    if (!existsSync(sessionPath)) {
        mkdirSync(sessionPath, { recursive: true });
    }
    return sessionPath;
}

function hasValidSession() {
    try {
        const credsPath = path.join(__dirname, 'session', 'creds.json');
        
        if (!existsSync(credsPath)) {
            return false;
        }
        
        const fileContent = fs.readFileSync(credsPath, 'utf8');
        if (!fileContent || fileContent.trim().length === 0) {
            printLog('warning', 'creds.json exists but is empty');
            return false;
        }
        
        try {
            const creds = JSON.parse(fileContent);
            if (!creds.noiseKey || !creds.signedIdentityKey || !creds.signedPreKey) {
                printLog('warning', 'creds.json is missing required fields');
                return false;
            }
            if (creds.registered === false) {
                printLog('warning', 'Session credentials exist but are not registered');
                try {
                    rmSync(path.join(__dirname, 'session'), { recursive: true, force: true });
                } catch (e) {}
                return false;
            }
            
            printLog('success', 'Valid and registered session credentials found');
            return true;
        } catch (parseError) {
            printLog('warning', 'creds.json contains invalid JSON');
            return false;
        }
    } catch (error) {
        printLog('error', `Error checking session validity: ${error.message}`);
        return false;
    }
}

async function initializeSession() {
    ensureSessionDirectory();
    
    const txt = global.SESSION_ID || process.env.SESSION_ID;

    if (!txt) {
        printLog('warning', 'No SESSION_ID found in environment variables');
        if (hasValidSession()) {
            printLog('success', 'Existing session found. Using saved credentials');
            return true;
        }
        printLog('warning', 'No existing session found. Pairing code will be required');
        return false;
    }
    
    if (hasValidSession()) {
        return true;
    }
    
    try {
        await SaveCreds(txt);
        await delay(2000);
        
        if (hasValidSession()) {
            printLog('success', 'Session file verified and valid');
            await delay(1000);
            return true;
        } else {
            printLog('error', 'Session file not valid after download');
            return false;
        }
    } catch (error) {
        printLog('error', `Error downloading session: ${error.message}`);
        return false;
    }
}

server.listen(PORT, () => {
    printLog('success', `Server listening on port ${PORT}`);
});

async function startShyamDex() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion();
        
        ensureSessionDirectory();
        await delay(1000);
        
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        const msgRetryCounterCache = new NodeCache();

        const hasRegisteredCreds = state.creds && state.creds.registered !== undefined;
        printLog('info', `Credentials loaded. Registered: ${state.creds?.registered || false}`);

        const ghostMode = await store.getSetting('global', 'stealthMode');
        const isGhostActive = ghostMode && ghostMode.enabled;
        
        if (isGhostActive) {
            printLog('info', '👻 STEALTH MODE IS ACTIVE - Starting in stealth mode');
        }

        const ShyamDex = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: Browsers.macOS('Chrome'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: !isGhostActive,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid);
                let msg = await store.loadMessage(jid, key.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });

        const originalSendPresenceUpdate = ShyamDex.sendPresenceUpdate;
        const originalReadMessages = ShyamDex.readMessages;
        const originalSendReceipt = ShyamDex.sendReceipt;
        const originalSendReadReceipt = ShyamDex.sendReadReceipt;
        
        ShyamDex.sendPresenceUpdate = async function(...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled) {
                printLog('info', '👻 Blocked presence update (stealth mode)');
                return;
            }
            return originalSendPresenceUpdate.apply(this, args);
        };
        
        ShyamDex.readMessages = async function(...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled) {
                return;
            }
            return originalReadMessages.apply(this, args);
        };

        if (originalSendReceipt) {
            ShyamDex.sendReceipt = async function(...args) {
                const ghostMode = await store.getSetting('global', 'stealthMode');
                if (ghostMode && ghostMode.enabled) {
                    return;
                }
                return originalSendReceipt.apply(this, args);
            };
        }
        
        if (originalSendReadReceipt) {
            ShyamDex.sendReadReceipt = async function(...args) {
                const ghostMode = await store.getSetting('global', 'stealthMode');
                if (ghostMode && ghostMode.enabled) {
                    return;
                }
                return originalSendReadReceipt.apply(this, args);
            };
        }
        
        const originalQuery = ShyamDex.query;
        ShyamDex.query = async function(node, ...args) {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            if (ghostMode && ghostMode.enabled) {
                if (node && node.tag === 'receipt') {
                    return;
                }
                if (node && node.attrs && (node.attrs.type === 'read' || node.attrs.type === 'read-self')) {
                    return;
                }
            }
            return originalQuery.apply(this, [node, ...args]);
        };
        
        ShyamDex.isGhostMode = async () => {
            const ghostMode = await store.getSetting('global', 'stealthMode');
            return ghostMode && ghostMode.enabled;
        };

        ShyamDex.ev.on('creds.update', saveCreds);
        store.bind(ShyamDex.ev);
        
        ShyamDex.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek.message) return;
                
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') 
                    ? mek.message.ephemeralMessage.message 
                    : mek.message;

                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(ShyamDex, chatUpdate);
                    return;
                }

                if (!ShyamDex.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                    const isGroup = mek.key?.remoteJid?.endsWith('@g.us');
                    if (!isGroup) return;
                }

                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;

                if (ShyamDex?.msgRetryCounterCache) {
                    ShyamDex.msgRetryCounterCache.clear();
                }

                try {
                    await handleMessages(ShyamDex, chatUpdate);
                } catch (err) {
                    printLog('error', `Error in handleMessages: ${err.message}`);
                    if (mek.key && mek.key.remoteJid) {
                        await ShyamDex.sendMessage(mek.key.remoteJid, {
                            text: '❌ An error occurred while processing your message.',
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363391981891036@newsletter',
                                    newsletterName: 'SHYAM-MD OFC',
                                    serverMessageId: -1
                                }
                            }
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                printLog('error', `Error in messages.upsert: ${err.message}`);
            }
        });

        ShyamDex.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return decode.user && decode.server && decode.user + '@' + decode.server || jid;
            } else return jid;
        };

        ShyamDex.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = ShyamDex.decodeJid(contact.id);
                if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
            }
        });

        ShyamDex.getName = (jid, withoutContact = false) => {
            id = ShyamDex.decodeJid(jid);
            withoutContact = ShyamDex.withoutContact || withoutContact;
            let v;
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = ShyamDex.groupMetadata(id) || {};
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
            });
            else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === ShyamDex.decodeJid(ShyamDex.user.id) ?
                ShyamDex.user :
                (store.contacts[id] || {});
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
        };

        ShyamDex.public = true;
        ShyamDex.serializeM = (m) => smsg(ShyamDex, m, store);

        const isRegistered = state.creds?.registered === true;
        
        if (pairingCode && !isRegistered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api');

            printLog('warning', 'Session not registered. Pairing code required');

            let phoneNumberInput;
            if (!!global.phoneNumber) {
                phoneNumberInput = global.phoneNumber;
            } else if (process.env.PAIRING_NUMBER) {
                phoneNumberInput = process.env.PAIRING_NUMBER;
                printLog('info', `Using phone number from environment: ${phoneNumberInput}`);
            } else if (rl && !rl.closed) {
                phoneNumberInput = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 918137655273 (without + or spaces) : `)));
            } else {
                phoneNumberInput = phoneNumber;
                printLog('info', `Using default phone number: ${phoneNumberInput}`);
            }

            phoneNumberInput = phoneNumberInput.replace(/[^0-9]/g, '');

            const pn = require('awesome-phonenumber');
            if (!pn('+' + phoneNumberInput).isValid()) {
                printLog('error', 'Invalid phone number format');
                
                if (rl && !rl.closed) {
                    rl.close();
                }
                process.exit(1);
            }

            setTimeout(async () => {
                try {
                    let code = await ShyamDex.requestPairingCode(phoneNumberInput);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)));
                    printLog('success', `Pairing code generated: ${code}`);
                    
                    if (rl && !rl.closed) {
                        rl.close();
                        rl = null;
                    }
                } catch (error) {
                    printLog('error', `Failed to get pairing code: ${error.message}`);
                }
            }, 3000);
        } else if (isRegistered) {
            if (rl && !rl.closed) {
                rl.close();
                rl = null;
            }
        } else {
            printLog('warning', 'Waiting for connection to establish...');
            if (rl && !rl.closed) {
                rl.close();
                rl = null;
            }
        }

        ShyamDex.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s;
            
            if (qr) {
                printLog('info', 'QR Code generated. Please scan with WhatsApp');
            }
            
            if (connection === 'connecting') {
                printLog('connection', 'Connecting to WhatsApp...');
            }
            
            if (connection == "open") {
                printLog('success', 'Bot connected successfully!');
                const { startAutoBio } = require('./plugins/setbio');
                startAutoBio(ShyamDex); 
                const ghostMode = await store.getSetting('global', 'stealthMode');
                if (ghostMode && ghostMode.enabled) {
                    printLog('info', '👻 STEALTH MODE ACTIVE - Bot is in stealth mode');
                    console.log(chalk.gray('• No online status'));
                    console.log(chalk.gray('• No typing indicators'));
                }
                
                console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(ShyamDex.user, null, 2)));

                try {
                    const botNumber = ShyamDex.user.id.split(':')[0] + '@s.whatsapp.net';
                    const ghostStatus = (ghostMode && ghostMode.enabled) ? '\n👻 Stealth Mode: ACTIVE' : '';
                    
                    await ShyamDex.sendMessage(botNumber, {
                        text: `🤖 Bot Connected Successfully!\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Online and Ready!${ghostStatus}\n\n✅Make sure to join below channel`,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363391981891036@newsletter',
                                newsletterName: 'SHYAM-MD OFC',
                                serverMessageId: -1
                            }
                        }
                    });
                } catch (error) {
                    printLog('error', `Failed to send connection message: ${error.message}`);
                }

                 await delay(1999);
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'SHYAM-MD'} ]`)}\n\n`));
                console.log(chalk.cyan(`< ================================================== >`));
                console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: Dexsam07`));
                console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: Dexsam07`));
                console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`));
                console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: Mohammad Samim Akhtar`));
                console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`));
                console.log(chalk.blue(`Bot Version: ${settings.version}`));
                console.log(chalk.cyan(`Loaded Commands: ${commandHandler.commands.size}`));
                console.log(chalk.cyan(`Prefixes: ${settings.prefixes.join(', ')}`));
                console.log(chalk.gray(`Backend: ${store.getStats().backend}`));
                console.log();
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                
                printLog('error', `Connection closed - Status: ${statusCode}`);
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        rmSync('./session', { recursive: true, force: true });
                        printLog('warning', 'Session logged out. Please re-authenticate');
                    } catch (error) {
                        printLog('error', `Error deleting session: ${error.message}`);
                    }
                }
                
                if (shouldReconnect) {
                    printLog('connection', 'Reconnecting in 5 seconds...');
                    await delay(5000);
                    startShyamDex();
                }
            }
        });

        ShyamDex.ev.on('call', async (calls) => {
            await handleCall(ShyamDex, calls);
        });

        ShyamDex.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(ShyamDex, update);
        });

        ShyamDex.ev.on('status.update', async (status) => {
            await handleStatus(ShyamDex, status);
        });

        ShyamDex.ev.on('messages.reaction', async (reaction) => {
            await handleStatus(ShyamDex, reaction);
        });

        return ShyamDex;
    } catch (error) {
        printLog('error', `Error in startShyamDex: ${error.message}`);
        
        if (rl && !rl.closed) {
            rl.close();
            rl = null;
        }
        
        await delay(5000);
        startShyamDex();
    }
}


async function main() {
    printLog('info', 'Starting SHYAM MD BOT...');
    
    const sessionReady = await initializeSession();
    
    if (sessionReady) {
        printLog('success', 'Session initialization complete. Starting bot...');
    } else {
        printLog('warning', 'Session initialization incomplete. Will attempt pairing...');
    }
    
    await delay(3000);
    
    startShyamDex().catch(error => {
        printLog('error', `Fatal error: ${error.message}`);
        
        if (rl && !rl.closed) {
            rl.close();
        }
        
        process.exit(1);
    });
}

main();

const sessionDir = path.join(process.cwd(), 'session');

setInterval(() => {
  if (!fs.existsSync(sessionDir)) return;
  fs.readdir(sessionDir, (err, files) => {
    if (err) return;
    for (const file of files) {
      if (file === 'creds.json') continue;
      fs.unlink(path.join(sessionDir, file), () => {});
    }
  });
}, 3 * 60 * 1000);

const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
//  console.log('🧹 Temp folder auto-cleaned');
}, 1 * 60 * 60 * 1000);

const folders = [
  path.join(__dirname, './lib'),
  path.join(__dirname, './plugins')
];

let totalFiles = 0;
let okFiles = 0;
let errorFiles = 0;

folders.forEach(folder => {
  if (!fs.existsSync(folder)) return;

  fs.readdirSync(folder)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      totalFiles++;
      const filePath = path.join(folder, file);

      try {
        const code = fs.readFileSync(filePath, 'utf-8');
        const err = syntaxerror(code, file, {
          sourceType: 'script',
          allowAwaitOutsideFunction: true
        });

        if (err) {
          console.error(chalk.red(`❌ Syntax error in ${filePath}:\n${err}`));
          errorFiles++;
        } else {
          okFiles++;
        }
      } catch (e) {
        console.error(chalk.yellow(`⚠️ Cannot read file ${filePath}:\n${e}`));
        errorFiles++;
      }
    });
});

/**
* console.log(chalk.greenBright(`✅ OK files: ${okFiles}`));
* console.log(chalk.redBright(`❌Files with errors: ${errorFiles}\n`));
*/

process.on('uncaughtException', (err) => {
    printLog('error', `Uncaught Exception: ${err.message}`);
    console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
    printLog('error', `Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        printLog('error', `Address localhost:${PORT} in use`);
        server.close();
    } else {
        printLog('error', `Server error: ${error.message}`);
    }
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    printLog('info', 'index.js updated, reloading...');
    delete require.cache[file];
    require(file);
});


