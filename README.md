<p align="center">
  <img src="Shyam/wellcome.svg" width="100%" alt="Welcome"/>
</p>

______

[![Shyam](https://raw.githubusercontent.com/dexsam07/SHYAM-MD/main/Shyam/mr.svg)](https://whatsapp.com/channel/0029VbBgXTsKwqSKZKy38w2o)

___ 

<p align="center">
  <a href="https://github.com/dexsam07" target="_blank">
    <img src="./Shyam/dev-gold-mini.svg" width="300" alt="Developer — MR Shyam (Gold 3D)">
  </a>
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/0029VbBgXTsKwqSKZKy38w2o" target="_blank">
    <img src="./Shyam/channel-update.svg" width="350" alt="Bot Updating — WhatsApp Channel | Join Fast">
  </a>
</p>

---------

<p align="center">
<a href="https://github.com/dexsam07/SHYAM-MD"><img title="PUBLIC-BOT" src="https://img.shields.io/static/v1?label=Language&message=JavaScript&style=square&color=darkpink"></a> &nbsp;
  <img src="https://komarev.com/ghpvc/?username=SHYAM-MD&label=VIEWS&style=square&color=blue" />
</p>

-------------

<p align="center">
<img src="Shyam/feature-bot.svg" alt="Feature Bot" width="900"/>
</p>

<p align="center">
<img src="Shyam/license.svg" alt="License" width="200"/>
</p>

--------------

<p align="center">
<img src="Shyam/maintenance.svg" alt="Maintenance" width="120"/>
</p>

<p align="center">
  <a href="https://github.com/dexsam07/SHYAM-MD/fork" target="_blank">
    <img src="Shyam/forkstar-holo.svg" width="180" alt="Fork Star Bot Repo"/>
  </a>
</p>

---

## 🔥 **PAIRING SITES – 3 OPTIONS (HINGLISH MEIN SAMJHO)**

> **🔹 #1 – Fastest Pairing Site**  
> 👉 [dex-pair-ai.onrender.com](https://dex-pair-ai.onrender.com/) – **Tez session code milega**  

> **🔹 #2 – Mini Bot Single Pairing**  
> 👉 [the-dex-mini.onrender.com](https://the-dex-mini.onrender.com/) – **Ek baar pair karo, bot connect ho jayega**  

> **🔹 #3 – Normal Pairing (Stable)**  
> 👉 [dex-pairing-session.onrender.com](https://dex-pairing-session.onrender.com/) – **Session ID generate karo aur bot mein daalo**  

<p align="center">
  <a href="https://dex-pair-ai.onrender.com/" target="_blank">
    <img src="./Shyam/paircode-link.svg" width="195" alt="PAIR_CODE – Device Session ID">
  </a>
  <a href="https://the-dex-mini.onrender.com/" target="_blank">
    <img src="./Shyam/paircode-link.svg" width="195" alt="PAIR_CODE – Device Session ID">
  </a>
  <a href="https://dex-pairing-session.onrender.com/" target="_blank">
    <img src="./Shyam/paircode-link.svg" width="195" alt="PAIR_CODE – Device Session ID">
  </a>
</p>

---

## 🚀 **DEPLOYMENT – KAHAN KAISE KAREIN?**

<p align="center">
  <img src="./Shyam/deployment.svg" width="600" alt="SHYAM MD — Deployment Ticker">
</p>

<div align="center">
  <table>
    <tr>
      <td><a href="https://dashboard.heroku.com/new-app?template=https://github.com/dexsam07/SHYAM-MD" target="_blank"><img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white&labelColor=000000&color=0000FF"/></a></td>
      <td><a href="https://legacy.bot-hosting.net/?aff=1340584978613932053" target="_blank"><img src="https://img.shields.io/badge/Bot-Hosting-A52A2A?style=for-the-badge&logo=firefoxbrowser&logoColor=white&labelColor=000000"/></a></td>
    </tr>
    <tr>
      <td><a href="https://app.koyeb.com/deploy?name=SHYAM-MD-v6-koyeb&type=git&repository=dexsam07%2FSHYAM-MD&branch=main&builder=dockerfile&instance_type=free&regions&=was&env%5BSESSION_ID%5D=" target="_blank"><img src="https://img.shields.io/badge/KOYEB-APP-FF009D?style=for-the-badge&logo=koyeb&logoColor=white&labelColor=000000"/></a></td>
      <td><a href="https://railway.app/new" target="_blank"><img src="https://img.shields.io/badge/Railway-000080?style=for-the-badge&logo=railway&logoColor=white&labelColor=000000"/></a></td>
    </tr>
    <tr>
      <td><a href="https://dashboard.katabump.com/auth/login#3c8183" target="_blank"><img src="https://img.shields.io/badge/KataBump-000000?style=for-the-badge&logo=render&logoColor=white&labelColor=000000&color=FFFF00"/></a></td>
      <td><a href="https://www.smd-host.site/" target="_blank"><img src="https://img.shields.io/badge/Free-host-CC00FF?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=000000"/></a></td>
    </tr>
  </table>
</div>

<table align="center">
  <tr>
    <td>
      <a href="https://github.com/dexsam07/SHYAM-MD" target="_blank">
        <img alt="Deploy From Render" src="https://img.shields.io/badge/Deploy-Only%20Render%20Repo-4CAF50?style=for-the-badge&logo=render&logoColor=white"/>
      </a>
    </td>
  </tr>
</table>  

---

## 🧠 **GITHUB WORKFLOW – FREE DEPLOYMENT (ERROR FIXED)**

> **Yeh code apne `.github/workflows/node.js.yml` mein daalo – GitHub Actions automatically bot deploy karega!**

```yaml
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [24.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        check-latest: true

    - name: Install dependencies
      run: npm install

    - name: Build project (optional)
      run: npm run build || echo "No build script found, skipping..."

    - name: Start application
      run: npm start
```

---

📦 LOCAL SETUP – APNE PC PE KAISE CHALAYEIN?

```bash
# 1. Repo clone karo
git clone https://github.com/dexsam07/SHYAM-MD.git

# 2. Folder mein jaao
cd SHYAM-MD

# 3. Dependencies install karo
npm install

# 4. Bot start karo
npm start
```

💡 Tip: Pairing code ke liye upar diye gaye teen (3) links mein se kisi ek par jaake session ID generate karo aur bot mein daalo.

---

✨ FEATURES – KYA-KYA HAI ISME?

· ✅ Auto-reply on WhatsApp
· ✅ AI-based chat (like ChatGPT)
· ✅ Sticker maker, meme generator
· ✅ Group management (welcome, goodbye, anti-link)
· ✅ YouTube & Instagram downloader
· ✅ Weather, news, and more
· ✅ Fully customizable

🔮 Aur bhi bahut kuch – explore karo!

---

⚠️ WARNING – CHETAVANI!

<div style="background-color: #000000; border-left: 5px solid #ff00ff; padding: 10px; border-radius: 0 15px 15px 0; box-shadow: 0 0 15px #ff00ff;">
  <h3 style="color: #00ffff;">⚠️ DISCLAIMER</h3>
  <p style="color: #ffffff;">
    <b>🔴 Yeh Bot WhatsApp Inc. Se Affiliate Nahi Hai |</b><br>
    <b>🔴 Iska Use Apni Jimmedari Par Karein |</b><br>
    <b>🔴 Galat Istemal Se Account Ban Ho Sakta Hai</b>
  </p>
</div>

---

🌟 CONTRIBUTORS & SUPPORTERS

https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&duration=3000&pause=1000&color=58A6FF&background=00000000&center=true&vCenter=true&width=500&lines=THANKS+TO+ALL+CONTRIBUTORS+%F0%9F%99%8F;SPECIAL+THANKS+TO+OUR+STAR+SUPPORTERS+%E2%AD%90

<p align="center">
  <a href="https://github.com/dexsam07/SHYAM-MD/stargazers">
    <img src="http://reporoster.com/stars/dark/dexsam07/SHYAM-MD" alt="Stargazers Repo Roster For @dexsam07/SHYAM-MD">
  </a>
</p>

<p align="center">
  <a href="https://github.com/dexsam07/SHYAM-MD/network/members">
    <img src="http://reporoster.com/forks/dark/dexsam07/SHYAM-MD" alt="Forkers Repo Roster For @dexsam07/SHYAM-MD">
  </a>
</p>

---

📢 STAY CONNECTED – UPDATES & TUTORIALS

<a href="https://youtube.com/@dex-shyam-tech" target="_blank">
  <img src="Shyam/youtube.svg" alt="YouTube" width="250"/>
</a>

<p align="center">
  <img src="Shyam/nolove.svg" alt="NoLove" width="250"/>
</p>

---

<p align="center">
  <img src="https://i.imgur.com/LyHic3i.gif" alt="divider"/>
</p>

<p align="center">
  <b>❤️ Made with 💀 by MR Shyam (Dex-Sam) ❤️</b><br>
  <b>⭐ Agar acha laga toh GitHub par Star zaroor karein! ⭐</b>
</p>

<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%" alt="divider"/>
</p>
