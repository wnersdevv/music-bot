const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const config = require('../../config/config');

const categories = {
  muzik: {
    label: '🎵 Müzik',
    desc: 'Temel oynatma komutları',
    commands: ['/çal', '/duraklat', '/devam', '/durdur', '/geç', '/şu-çalan', '/ses', '/döngü', '/karıştır']
  },
  arama: {
    label: '🔎 Arama',
    desc: 'Şarkı ve sanatçı arama',
    commands: ['/ara', '/şarkı-ara', '/sanatçı-ara', '/öner', '/rastgele']
  },
  kuyruk: {
    label: '📋 Kuyruk',
    desc: 'Kuyruk yönetimi',
    commands: ['/kuyruk', '/kuyruk-temizle', '/kuyruktan-çıkar', '/kuyrukta-taşı']
  },
  favoriler: {
    label: '❤️ Favoriler',
    desc: 'Favori şarkı yönetimi',
    commands: ['/favori-ekle', '/favori-sil', '/favoriler', '/favori-çal']
  },
  playlist: {
    label: '🎼 Playlist',
    desc: 'Kişisel çalma listeleri',
    commands: ['/playlist oluştur', '/playlist ekle', '/playlist oynat', '/playlist liste']
  },
  radyo: {
    label: '📻 Radyo',
    desc: 'Tür bazlı sürekli yayın',
    commands: ['/radyo-başlat', '/radyo-tür', '/radyo-durdur']
  },
  ai: {
    label: '🤖 Yapay Zeka',
    desc: 'AI destekli öneriler',
    commands: ['/ai-mood', '/ai-öner', '/ai-keşfet']
  },
  profil: {
    label: '👤 Profil',
    desc: 'Kişisel müzik profilin',
    commands: ['/profil', '/müzik-profilim', '/en-çok-dinlediklerim']
  },
  istatistik: {
    label: '📊 İstatistik',
    desc: 'Sunucu ve kullanıcı istatistikleri',
    commands: ['/istatistik', '/top-şarkılar', '/top-sanatçılar']
  },
  ayarlar: {
    label: '⚙️ Ayarlar',
    desc: 'Sunucu müzik ayarları',
    commands: ['/ayarlar dil', '/ayarlar dj', '/ayarlar 24-7']
  },
  hakkinda: {
    label: 'ℹ️ Hakkında',
    desc: `${config.brand} hakkında bilgi`,
    commands: [`Geliştirici: ${config.brand}`]
  }
};

function buildHelpPanel(activeCategory = 'muzik') {
  const cat = categories[activeCategory] || categories.muzik;
  const container = new ContainerBuilder().setAccentColor(config.colors.primary);

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`### 🎵 ${config.brand} MUSIC\nMüzik deneyimini yönetmek için aşağıdaki kategorilerden birini seç.`)
  );
  container.addSeparatorComponents(new SeparatorBuilder());

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `**${cat.label}**\n${cat.desc}\n\n${cat.commands.map((c) => `\`${c}\``).join('\n')}`
    )
  );

  const select = new StringSelectMenuBuilder()
    .setCustomId('help:category')
    .setPlaceholder('Bir kategori seç')
    .addOptions(
      Object.entries(categories).map(([value, c]) => ({
        label: c.label,
        value,
        default: value === activeCategory
      }))
    );

  container.addActionRowComponents(new ActionRowBuilder().addComponents(select));
  return container;
}

module.exports = { buildHelpPanel, categories };
