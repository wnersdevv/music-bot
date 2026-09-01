const mongoose = require('mongoose');
const config = require('../../config/config');

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Bağlantı kuruldu.');
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Bağlantı koptu, yeniden bağlanılıyor...');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Hata:', err.message);
  });

  await mongoose.connect(config.mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000
  });
}

module.exports = { connectDatabase };
