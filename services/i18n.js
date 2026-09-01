const tr = require('../locales/tr.json');
const en = require('../locales/en.json');
const GuildModel = require('../database/models/Guild');

const dictionaries = { tr, en };
const guildLangCache = new Map();

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), dict);
}

function format(str, vars = {}) {
  if (!str) return str;
  return str.replace(/%\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `%{${key}}`));
}

async function getGuildLanguage(guildId) {
  if (guildLangCache.has(guildId)) return guildLangCache.get(guildId);
  const doc = await GuildModel.findOne({ guildId }).lean();
  const lang = doc?.language || 'tr';
  guildLangCache.set(guildId, lang);
  return lang;
}

function setGuildLanguageCache(guildId, lang) {
  guildLangCache.set(guildId, lang);
}

async function t(guildId, path, vars = {}) {
  const lang = await getGuildLanguage(guildId);
  const dict = dictionaries[lang] || dictionaries.tr;
  const str = resolve(dict, path) || resolve(dictionaries.tr, path) || path;
  return format(str, vars);
}

module.exports = { t, getGuildLanguage, setGuildLanguageCache };
