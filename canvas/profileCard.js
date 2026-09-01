const { createCanvas, loadImage } = require('canvas');

async function buildProfileCard({ username, avatarUrl, totalListenMs, totalTracksPlayed, topArtist }) {
  const canvas = createCanvas(900, 350);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 900, 350);
  gradient.addColorStop(0, '#1e1033');
  gradient.addColorStop(1, '#0f0620');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 350);

  try {
    const avatar = await loadImage(avatarUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(175, 175, 110, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 65, 65, 220, 220);
    ctx.restore();
  } catch {
    // avatar yüklenemezse boş bırak
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(username, 320, 110);

  ctx.fillStyle = '#a78bfa';
  ctx.font = '24px sans-serif';
  const hours = Math.floor(totalListenMs / 1000 / 60 / 60);
  ctx.fillText(`🎧 ${hours} saat dinleme`, 320, 160);
  ctx.fillText(`🎵 ${totalTracksPlayed} şarkı çalındı`, 320, 200);
  ctx.fillText(`⭐ En çok dinlenen: ${topArtist || 'Henüz yok'}`, 320, 240);

  ctx.fillStyle = '#6d28d9';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('wnersdev', 780, 330);

  return canvas.toBuffer('image/png');
}

module.exports = { buildProfileCard };
