const fs = require('fs');
const path = require('path');

// Token ve tüm gizli anahtarlar proje kökündeki "ayarlar.json" dosyasından okunur.
// .ENV KULLANILMAZ — asla kullanılmayacak.
const settingsPath = path.join(__dirname, '..', 'ayarlar.json');

if (!fs.existsSync(settingsPath)) {
  throw new Error(
    `ayarlar.json bulunamadı. Proje kök dizinine "ayarlar.json" oluştur ve DISCORD_TOKEN, CLIENT_ID, MONGODB_URI vb. alanları doldur. Beklenen konum: ${settingsPath}`
  );
}

const raw = fs.readFileSync(settingsPath, 'utf-8');
let settings;
try {
  settings = JSON.parse(raw);
} catch (err) {
  throw new Error(`ayarlar.json geçersiz JSON formatında: ${err.message}`);
}

module.exports = {
  token: settings.DISCORD_TOKEN,
  clientId: settings.CLIENT_ID,
  mongoUri: settings.MONGODB_URI,
  youtubeApiKey: settings.YOUTUBE_API_KEY,
  aiApiKey: settings.AI_API_KEY,

  brand: 'wnersdev',
  defaultLang: 'tr',
  defaultVolume: 80,
  maxQueueSize: 500,
  cacheTTL: 1000 * 60 * 10,

  colors: {
    primary: 0x8b5cf6,
    success: 0x22c55e,
    error: 0xef4444,
    warning: 0xf59e0b,
    info: 0x38bdf8
  },

  devIds: Array.isArray(settings.DEV_IDS) ? settings.DEV_IDS : []
};
