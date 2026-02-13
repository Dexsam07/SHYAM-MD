const settings = {
  // Command prefixes (array - supports multiple)
  prefixes: ['.', '!', '/'],

  // Sticker pack & author name
  packname: 'SHYAM-BOT',
  author: 'dexsam07',

  // Timezone for logs & time-based features
  timeZone: 'Asia/Kolkata',

  // Bot display name
  botName: 'SHYAM-MD',

  // Owner information
  botOwner: 'Dex Shyam Chaudhari',
  ownerNumber: '917384287404',          // without + or spaces

  // Giphy API key (for gif commands if used)
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',

  // Command access mode
  commandMode: 'public',                // 'public' or 'private'

  // Store / message cache settings
  maxStoreMessages: 20,
  storeWriteInterval: 10000,            // 10 seconds

  // Temp file cleanup interval (1 hour)
  tempCleanupInterval: 1 * 60 * 60 * 1000,

  // Bot description (used in some menus/about)
  description: 'This is a bot for managing group commands and automating tasks.',

  // Version & update info
  version: '5.1.0',
  updateZipUrl: 'https://github.com/Dexsam07/SHYAM-MD/archive/refs/heads/main.zip',

  // Promotion / channel links
  channelLink: 'https://whatsapp.com/channel/0029VbBgXTsKwqSKZKy38w2o',
  ytch: '@Dex_shyam_07'
};

module.exports = settings;