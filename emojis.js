// Tüm botta kullanılan emojiler buradan yönetilir.
// Custom emoji ID'lerini doğrudan aşağıdaki map üzerinden değiştirebilirsin.

const customIds = {
  music: '',
  play: '',
  pause: '',
  stop: '',
  skip: '',
  queue: '',
  search: '',
  youtube: '',
  spotify: '',
  volume: '',
  favorite: '',
  playlist: '',
  radio: '',
  ai: '',
  settings: '',
  success: '',
  error: '',
  warning: '',
  loading: '',
  home: '',
  back: '',
  next: '',
  previous: ''
};

const fallback = {
  music: '🎵',
  play: '▶️',
  pause: '⏸️',
  stop: '⏹️',
  skip: '⏭️',
  queue: '📋',
  search: '🔎',
  youtube: '📺',
  spotify: '🟢',
  volume: '🔊',
  favorite: '❤️',
  playlist: '🎼',
  radio: '📻',
  ai: '🤖',
  settings: '⚙️',
  success: '✅',
  error: '❌',
  warning: '⚠️',
  loading: '⏳',
  home: '🏠',
  back: '◀️',
  next: '▶️',
  previous: '⏮️'
};

const emojis = {};
for (const key of Object.keys(fallback)) {
  emojis[key] = customIds[key] ? `<:${key}:${customIds[key]}>` : fallback[key];
}

module.exports = emojis;
