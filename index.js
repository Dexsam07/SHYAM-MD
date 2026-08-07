/**
 * • Protected by DEX MIDNIGHT CYBER 🪀
 * • Editor: mother fucker ☠️
 * • Smart Launcher V2 — Health Check + Auto Backup + Auto Recovery
 */
'use strict';

const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { spawn } = require('child_process');

// ============================================================
//  CONFIGURATION
// ============================================================
const BOT_DIR = path.join(__dirname, 'bot');
const BOT_INDEX = path.join(BOT_DIR, 'index.js');
const YT_DLP = path.join(BOT_DIR, 'yt-dlp');
const YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
const STOP_FLAG = path.join(BOT_DIR, 'data', '.bot-stopped');
const SESSION_DIR = path.join(BOT_DIR, 'session');
const BACKUP_DIR = path.join(BOT_DIR, 'session_backup');
const LOCK_FILE = path.join(__dirname, '.launcher.pid');
const PORT = process.env.PORT || 3000;

// ============================================================
//  HEALTH CHECK SERVER (Panel ko alive dikhane ke liye)
// ============================================================
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'alive',
      bot: currentBot ? 'running' : 'stopped',
      uptime: process.uptime(),
      pid: process.pid,
      version: 'SHYAM-MD Launcher V2'
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[launcher] 🌐 Health check server running on port ${PORT}`);
  console.log(`[launcher] 🔗 Health endpoint: http://localhost:${PORT}/health`);
});

// ============================================================
//  PID LOCK (Duplicate launcher prevent)
// ============================================================
function acquireLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const oldPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (oldPid && oldPid !== process.pid) {
        try {
          process.kill(oldPid, 'SIGTERM');
          console.log(`[launcher] Sent SIGTERM to old launcher PID ${oldPid}`);
        } catch (e) {}
        const deadline = Date.now() + 3000;
        while (Date.now() < deadline) {
          try { process.kill(oldPid, 0); } catch { break; }
        }
      }
    }
    fs.writeFileSync(LOCK_FILE, String(process.pid), 'utf8');
    console.log(`[launcher] Lock acquired (PID ${process.pid})`);
  } catch (e) {
    console.error('[launcher] Could not acquire lock:', e.message);
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const stored = parseInt(fs.readFileSync(LOCK_FILE, 'utf8').trim(), 10);
      if (stored === process.pid) fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
}

// ============================================================
//  🧹 FORCE DELETE STOP FLAG
// ============================================================
function nukeStopFlag() {
  try {
    if (fs.existsSync(STOP_FLAG)) {
      fs.unlinkSync(STOP_FLAG);
      console.log('[launcher] 🗑️ Nuked .bot-stopped flag!');
    }
  } catch (e) {
    console.log('[launcher] Could not delete flag:', e.message);
  }
}

// ============================================================
//  📁 SESSION BACKUP (Every hour)
// ============================================================
function backupSession() {
  try {
    const src = path.join(SESSION_DIR, 'creds.json');
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(BACKUP_DIR, `creds_${timestamp}.json`);
    fs.copyFileSync(src, dest);
    console.log('[launcher] 💾 Session backed up:', path.basename(dest));

    // Keep only last 10 backups
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('creds_') && f.endsWith('.json'))
      .sort();
    while (files.length > 10) {
      const old = files.shift();
      fs.unlinkSync(path.join(BACKUP_DIR, old));
      console.log('[launcher] 🗑️ Removed old backup:', old);
    }
  } catch (e) {
    console.log('[launcher] Backup error:', e.message);
  }
}

// ============================================================
//  ENSURE DATA DIRECTORY
// ============================================================
function ensureDataDir() {
  const dataDir = path.join(BOT_DIR, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('[launcher] Created data directory');
  }
}

// ============================================================
//  SHUTDOWN HANDLER
// ============================================================
let currentBot = null;
let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[launcher] ${signal} received — stopping child bot...`);
  if (currentBot) {
    try {
      currentBot.kill('SIGTERM');
      setTimeout(() => {
        try { currentBot.kill('SIGKILL'); } catch {}
      }, 5000);
    } catch {}
  }
  // Final backup on shutdown
  backupSession();
  releaseLock();
  setTimeout(() => process.exit(0), 6000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('exit', () => releaseLock());

// ============================================================
//  yt-dlp DOWNLOADER
// ============================================================
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (u) => https.get(u, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
    get(url);
  });
}

async function ensureYtDlp() {
  if (fs.existsSync(YT_DLP)) return;
  console.log('[launcher] yt-dlp missing — downloading latest...');
  await download(YT_DLP_URL, YT_DLP);
  fs.chmodSync(YT_DLP, '755');
  console.log('[launcher] yt-dlp ready.');
}

// ============================================================
//  🚀 BOT CHILD MANAGER WITH AUTO-RECOVERY
// ============================================================
function startBot() {
  if (shuttingDown) return;

  ensureDataDir();
  nukeStopFlag();

  console.log('[launcher] 🚀 Starting bot...');
  const bot = spawn(process.execPath, [BOT_INDEX], {
    stdio: 'inherit',
    env: process.env,
    cwd: BOT_DIR,
  });
  currentBot = bot;

  // Backup immediately after bot starts
  setTimeout(backupSession, 5000);

  bot.on('exit', (code) => {
    currentBot = null;
    if (shuttingDown) return;

    // Backup before restart
    backupSession();

    if (code === 0 || code === 1) {
      console.log(`[launcher] Bot exited with code ${code}. Deleting flag and restarting in 3s...`);
      nukeStopFlag();
      setTimeout(startBot, 3000);
    } else {
      console.log(`[launcher] Bot stopped with code ${code}. Launcher staying alive.`);
      nukeStopFlag();
    }
  });

  bot.on('error', (err) => {
    console.error('[launcher] Bot spawn error:', err);
    setTimeout(startBot, 5000);
  });
}

// ============================================================
//  AUTO-INSTALL DEPENDENCIES
// ============================================================
function ensureDeps() {
  return new Promise((resolve) => {
    const nmDir = path.join(BOT_DIR, 'node_modules');
    const testMod = path.join(nmDir, 'dotenv');
    if (fs.existsSync(testMod)) return resolve();
    console.log('[launcher] node_modules missing — running npm install in bot/...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install --omit=dev', { cwd: BOT_DIR, stdio: 'inherit', timeout: 180000 });
      console.log('[launcher] npm install complete.');
    } catch (e) {
      console.error('[launcher] npm install failed:', e.message);
    }
    resolve();
  });
}

// ============================================================
//  SCHEDULED BACKUP (Every hour)
// ============================================================
setInterval(backupSession, 3600000);

// ============================================================
//  ENTRY POINT
// ============================================================
acquireLock();
ensureDeps()
  .then(() => ensureYtDlp().catch((err) => console.error('[launcher] yt-dlp download failed:', err.message)))
  .finally(startBot);

console.log(`
╔══════════════════════════════════════════════════════════════╗
║   🚀 SHYAM-MD Smart Launcher V2                             ║
║   📡 Health: http://localhost:${PORT}/health                    ║
║   💾 Backup: Every hour (keeps last 10)                     ║
║   🔄 Auto-Recovery: Code 0 & 1 both restart                 ║
║   🗑️ Flag Nuke: .bot-stopped auto-deleted                  ║
╚══════════════════════════════════════════════════════════════╝
`);
