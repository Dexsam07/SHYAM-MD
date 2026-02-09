// index.js - SHYAM-MD Bot (with base64 decode support)
// पहले base64 decode वाला हिस्सा रखा है, ताकि बाद में obfuscate करने पर भी चले

// ====================== BASE64 DECODE + RUN PART ======================
const encodedCode = ""; // ← बाद में यहाँ अपना पूरा base64 string paste करना (अभी खाली है)

// अगर encodedCode भरा हुआ है तो decode करके run करो
if (encodedCode && encodedCode.trim() !== "") {
  try {
    const decoded = Buffer.from(encodedCode, 'base64').toString('utf-8');
    eval(decoded);
    console.log("[LAUNCHER] Base64 code successfully decoded and executed!");
    // अगर decode के बाद कोई main/startDexDev फंक्शन expose हुआ तो उसे call कर सकते हो
    if (typeof main === 'function') main();
    else if (typeof startDexDev === 'function') startDexDev();
  } catch (err) {
    console.error("[LAUNCHER] Base64 decode या execution में error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
} else {
  // अगर base64 खाली है तो नीचे वाला नॉर्मल कोड run होगा (अभी के लिए)
  console.log("[LAUNCHER] Running normal code (base64 empty hai)");
  
  // ====================== NORMAL BOT CODE (तुम्हारा पूरा कोड) ======================

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

  let phoneNumber = global.PAIRING_NUMBER || process.env.PAIRING_NUMBER || "917384287404";
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

  // ... बाकी पूरा कोड (ensureSessionDirectory, hasValidSession, initializeSession, startDexDev, main, temp folder clean, folders check, uncaughtException, etc.) ...

  // आखिरी लाइनें (watchFile आदि)
  let file = require.resolve(__filename);
  fs.watchFile(file, () => {
      fs.unwatchFile(file);
      printLog('info', 'index.js updated, reloading...');
      delete require.cache[file];
      require(file);
  });

  // अगर base64 खाली है तो main को call करो
  main().catch(err => {
      console.error("Main function error:", err);
  });
}