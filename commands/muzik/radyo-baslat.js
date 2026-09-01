const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { search } = require('../../search/searchService');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureInVoice } = require('../../utils/voiceGuard');

const genres = {
  pop: 'pop müzik karışımı',
  rock: 'rock müzik karışımı',
  rap: 'rap müzik karışımı',
  lofi: 'lo-fi chill beats',
  turkce_pop: 'türkçe pop hit karışımı',
  arabesk: 'arabesk şarkılar karışımı',
  klasik: 'klasik müzik karışımı',
  seksenler: '80ler nostalji şarkılar',
  doksanlar: '90lar nostalji şarkılar',
  ikibinler: '2000ler hit şarkılar'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radyo-başlat')
    .setDescription('Tür bazlı sürekli radyo yayını başlatır')
    .addStringOption((opt) =>
      opt.setName('tür').setDescription('Radyo türü').setRequired(true).addChoices(
        { name: '🎵 Pop', value: 'pop' },
        { name: '🎸 Rock', value: 'rock' },
        { name: '🎤 Rap', value: 'rap' },
        { name: '🌙 Lo-Fi', value: 'lofi' },
        { name: '🔥 Türkçe Pop', value: 'turkce_pop' },
        { name: '🎼 Arabesk', value: 'arabesk' },
        { name: '🎹 Klasik', value: 'klasik' },
        { name: "💿 80'ler", value: 'seksenler' },
        { name: "💿 90'lar", value: 'doksanlar' },
        { name: "💿 2000'ler", value: 'ikibinler' }
      )
    ),

  async execute(interaction) {
    const voiceCheck = await ensureInVoice(interaction);
    if (!voiceCheck.ok) return interaction.reply({ embeds: [errorEmbed(voiceCheck.message)], ephemeral: true });

    await interaction.deferReply();
    const genre = interaction.options.getString('tür');
    const tracks = await search(genres[genre], { requestedBy: interaction.user, limit: 10 });

    if (!tracks.length) return interaction.editReply({ embeds: [errorEmbed('Radyo için şarkı bulunamadı.')] });

    const player = useMainPlayer();
    for (const track of tracks) {
      await player.play(interaction.member.voice.channel, track.url, {
        nodeOptions: { metadata: { channel: interaction.channel }, volume: 80, leaveOnEmpty: false, repeatMode: 2 },
        requestedBy: interaction.user
      }).catch(() => {});
    }

    await interaction.editReply({ embeds: [successEmbed(`📻 Radyo başlatıldı: **${genre}**`)] });
  }
};
