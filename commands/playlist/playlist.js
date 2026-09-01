const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const Playlist = require('../../database/models/Playlist');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed, baseEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Kişisel çalma listelerini yönetir')
    .addSubcommand((sub) =>
      sub.setName('oluştur').setDescription('Yeni playlist oluşturur')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('sil').setDescription('Playlist siler')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand((sub) =>
      sub.setName('ekle').setDescription('Playliste şarkı ekler')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
        .addStringOption((o) => o.setName('şarkı').setDescription('Eklenecek şarkı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('çıkar').setDescription('Playlistten şarkı çıkarır')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
        .addIntegerOption((o) => o.setName('sıra').setDescription('Şarkı sıra numarası').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('liste').setDescription('Playlistlerini listeler')
    )
    .addSubcommand((sub) =>
      sub.setName('göster').setDescription('Bir playlistin içeriğini gösterir')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand((sub) =>
      sub.setName('oynat').setDescription('Playlisti çalar')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand((sub) =>
      sub.setName('karıştır').setDescription('Playlisti karıştırıp çalar')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand((sub) =>
      sub.setName('düzenle').setDescription('Playlist adını değiştirir')
        .addStringOption((o) => o.setName('isim').setDescription('Mevcut playlist adı').setRequired(true).setAutocomplete(true))
        .addStringOption((o) => o.setName('yeni-isim').setDescription('Yeni ad').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('kopyala').setDescription('Playlisti kopyalar')
        .addStringOption((o) => o.setName('isim').setDescription('Kopyalanacak playlist').setRequired(true).setAutocomplete(true))
        .addStringOption((o) => o.setName('yeni-isim').setDescription('Kopyanın adı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('taşı').setDescription('Playlist içinde şarkı sırasını değiştirir')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
        .addIntegerOption((o) => o.setName('kaynak').setDescription('Mevcut sıra').setRequired(true).setMinValue(1))
        .addIntegerOption((o) => o.setName('hedef').setDescription('Yeni sıra').setRequired(true).setMinValue(1))
    )
    .addSubcommand((sub) =>
      sub.setName('paylaş').setDescription('Playlisti paylaşılabilir yapar (public)')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand((sub) =>
      sub.setName('dışa-aktar').setDescription('Playlisti metin olarak dışa aktarır')
        .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true).setAutocomplete(true))
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const playlists = await Playlist.find({ userId: interaction.user.id, name: new RegExp(focused, 'i') })
      .limit(20)
      .lean();
    await interaction.respond(playlists.map((p) => ({ name: p.name, value: p.name })));
  },

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const handler = handlers[sub];
    if (!handler) return interaction.reply({ embeds: [errorEmbed('Bilinmeyen alt komut.')], ephemeral: true });
    await handler(interaction);
  }
};

const handlers = {
  async oluştur(interaction) {
    const name = interaction.options.getString('isim');
    const exists = await Playlist.findOne({ userId: interaction.user.id, name });
    if (exists) return interaction.reply({ embeds: [errorEmbed('Bu isimde bir playlistin zaten var.')], ephemeral: true });

    await Playlist.create({ userId: interaction.user.id, name, tracks: [] });
    await interaction.reply({ embeds: [successEmbed(`**${name}** playlisti oluşturuldu.`)], ephemeral: true });
  },

  async sil(interaction) {
    const name = interaction.options.getString('isim');
    const deleted = await Playlist.findOneAndDelete({ userId: interaction.user.id, name });
    if (!deleted) return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı.')], ephemeral: true });
    await interaction.reply({ embeds: [successEmbed(`**${name}** playlisti silindi.`)], ephemeral: true });
  },

  async ekle(interaction) {
    const name = interaction.options.getString('isim');
    const query = interaction.options.getString('şarkı');
    await interaction.deferReply({ ephemeral: true });

    const playlist = await Playlist.findOne({ userId: interaction.user.id, name });
    if (!playlist) return interaction.editReply({ embeds: [errorEmbed('Playlist bulunamadı.')] });

    const [track] = await search(query, { requestedBy: interaction.user, limit: 1 });
    if (!track) return interaction.editReply({ embeds: [errorEmbed('Şarkı bulunamadı.')] });

    playlist.tracks.push({ title: track.title, url: track.url, duration: track.duration, thumbnail: track.thumbnail });
    await playlist.save();

    await interaction.editReply({ embeds: [successEmbed(`**${track.title}** → **${name}** playlistine eklendi.`)] });
  },

  async çıkar(interaction) {
    const name = interaction.options.getString('isim');
    const index = interaction.options.getInteger('sıra') - 1;

    const playlist = await Playlist.findOne({ userId: interaction.user.id, name });
    if (!playlist || !playlist.tracks[index]) {
      return interaction.reply({ embeds: [errorEmbed('Şarkı veya playlist bulunamadı.')], ephemeral: true });
    }

    const [removed] = playlist.tracks.splice(index, 1);
    await playlist.save();
    await interaction.reply({ embeds: [successEmbed(`**${removed.title}** playlistten çıkarıldı.`)], ephemeral: true });
  },

  async liste(interaction) {
    const playlists = await Playlist.find({ userId: interaction.user.id }).lean();
    if (!playlists.length) return interaction.reply({ embeds: [errorEmbed('Henüz playlistin yok.')], ephemeral: true });

    const list = playlists.map((p) => `🎼 **${p.name}** — ${p.tracks.length} şarkı`).join('\n');
    await interaction.reply({ embeds: [baseEmbed().setTitle('Playlistlerin').setDescription(list)], ephemeral: true });
  },

  async göster(interaction) {
    const name = interaction.options.getString('isim');
    const playlist = await Playlist.findOne({ userId: interaction.user.id, name }).lean();
    if (!playlist) return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı.')], ephemeral: true });

    const list = playlist.tracks.map((t, i) => `**${i + 1}.** ${t.title}`).join('\n') || 'Playlist boş.';
    await interaction.reply({ embeds: [baseEmbed().setTitle(`🎼 ${name}`).setDescription(list)], ephemeral: true });
  },

  async oynat(interaction) {
    await playPlaylist(interaction, false);
  },

  async karıştır(interaction) {
    await playPlaylist(interaction, true);
  },

  async düzenle(interaction) {
    const name = interaction.options.getString('isim');
    const newName = interaction.options.getString('yeni-isim');

    const exists = await Playlist.findOne({ userId: interaction.user.id, name: newName });
    if (exists) return interaction.reply({ embeds: [errorEmbed('Bu isimde bir playlist zaten var.')], ephemeral: true });

    const updated = await Playlist.findOneAndUpdate({ userId: interaction.user.id, name }, { name: newName });
    if (!updated) return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı.')], ephemeral: true });

    await interaction.reply({ embeds: [successEmbed(`**${name}** → **${newName}** olarak yeniden adlandırıldı.`)], ephemeral: true });
  },

  async kopyala(interaction) {
    const name = interaction.options.getString('isim');
    const newName = interaction.options.getString('yeni-isim');

    const original = await Playlist.findOne({ userId: interaction.user.id, name }).lean();
    if (!original) return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı.')], ephemeral: true });

    const exists = await Playlist.findOne({ userId: interaction.user.id, name: newName });
    if (exists) return interaction.reply({ embeds: [errorEmbed('Bu isimde bir playlist zaten var.')], ephemeral: true });

    await Playlist.create({ userId: interaction.user.id, name: newName, tracks: original.tracks, isPublic: false });
    await interaction.reply({ embeds: [successEmbed(`**${name}** → **${newName}** olarak kopyalandı.`)], ephemeral: true });
  },

  async taşı(interaction) {
    const name = interaction.options.getString('isim');
    const from = interaction.options.getInteger('kaynak') - 1;
    const to = interaction.options.getInteger('hedef') - 1;

    const playlist = await Playlist.findOne({ userId: interaction.user.id, name });
    if (!playlist || !playlist.tracks[from]) {
      return interaction.reply({ embeds: [errorEmbed('Playlist veya şarkı bulunamadı.')], ephemeral: true });
    }

    const [moved] = playlist.tracks.splice(from, 1);
    playlist.tracks.splice(to, 0, moved);
    await playlist.save();

    await interaction.reply({ embeds: [successEmbed(`**${moved.title}** yeni sıraya taşındı.`)], ephemeral: true });
  },

  async paylaş(interaction) {
    const name = interaction.options.getString('isim');
    const playlist = await Playlist.findOneAndUpdate({ userId: interaction.user.id, name }, { isPublic: true });
    if (!playlist) return interaction.reply({ embeds: [errorEmbed('Playlist bulunamadı.')], ephemeral: true });

    await interaction.reply({
      embeds: [successEmbed(`**${name}** artık herkese açık. Paylaşım kodu: \`${playlist._id}\``)],
      ephemeral: true
    });
  },

  async ['dışa-aktar'](interaction) {
    const name = interaction.options.getString('isim');
    const playlist = await Playlist.findOne({ userId: interaction.user.id, name }).lean();
    if (!playlist?.tracks?.length) return interaction.reply({ embeds: [errorEmbed('Playlist boş veya bulunamadı.')], ephemeral: true });

    const exportText = playlist.tracks.map((t) => t.url).join('\n');
    await interaction.reply({ content: `**${name}** dışa aktarıldı:\n\`\`\`\n${exportText.slice(0, 1900)}\n\`\`\``, ephemeral: true });
  }
};

async function playPlaylist(interaction, shuffle) {
  const voiceCheck = await ensureInVoice(interaction);
  if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

  const name = interaction.options.getString('isim');
  const playlist = await Playlist.findOne({ userId: interaction.user.id, name }).lean();
  if (!playlist || !playlist.tracks.length) {
    return interaction.reply({ embeds: [errorEmbed('Playlist boş veya bulunamadı.')], ephemeral: true });
  }

  await interaction.deferReply();
  const player = useMainPlayer();
  const tracks = shuffle ? [...playlist.tracks].sort(() => Math.random() - 0.5) : playlist.tracks;

  for (const track of tracks) {
    await player.play(interaction.member.voice.channel, track.url, {
      nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: true },
      requestedBy: interaction.user
    }).catch(() => {});
  }

  await interaction.editReply({ embeds: [successEmbed(`**${name}** playlisti kuyruğa eklendi (${tracks.length} şarkı).`)] });
}
