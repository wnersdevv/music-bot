const fetch = require('node-fetch');
const config = require('../config/config');
const { search } = require('../search/searchService');

// AI, doğrudan şarkı stream etmeye çalışmaz. Sadece arama sorgusu / öneri üretir,
// gerçek şarkılar her zaman search katmanından (YouTube) gelir.

async function askAI(prompt) {
  if (!config.aiApiKey) {
    throw new Error('AI_API_KEY tanımlı değil.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.aiApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) throw new Error(`AI API hatası: ${response.status}`);
  const data = await response.json();
  return data.content?.map((c) => c.text).filter(Boolean).join('\n') ?? '';
}

async function recommendByMood(mood, requestedBy) {
  const prompt = [
    'Kullanıcının ruh haline / isteğine uygun 5 şarkı önerisi üret.',
    'SADECE JSON dizi döndür, başka hiçbir şey yazma.',
    'Format: [{"query":"sanatçı - şarkı adı"}]',
    `İstek: "${mood}"`
  ].join('\n');

  const raw = await askAI(prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let queries;
  try {
    queries = JSON.parse(cleaned);
  } catch {
    queries = [{ query: mood }];
  }

  const results = [];
  for (const item of queries.slice(0, 5)) {
    const tracks = await search(item.query, { requestedBy, limit: 1 });
    if (tracks[0]) results.push(tracks[0]);
  }
  return results;
}

module.exports = { askAI, recommendByMood };
