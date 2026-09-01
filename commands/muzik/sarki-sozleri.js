const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const fetch = require('node-fetch');
const { errorEmbed, baseEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('şarkı-sözleri')
    .setDescription('Çalan şarkının sözlerini getirir')
    .addStringOption((o) => o.setName('şarkı').setDescription('Şarkı adı (boş bırakırsan çalan şarkı kullanılır)').setRequired(false)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const query = interaction.options.getString('şarkı') || queue?.currentTrack?.title;

    if (!query) {
      return interaction.reply({ embeds: [errorEmbed('Şarkı adı belirtmelisin veya bir şarkı çalıyor olmalı.')], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(query.split('-')[0] || 'unknown')}/${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();

      const lyrics = (data.lyrics || '').slice(0, 3800) || 'Söz bulunamadı.';
      await interaction.editReply({ embeds: [baseEmbed().setTitle(`📝 ${query}`).setDescription(lyrics)] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed('Bu şarkı için söz bulunamadı.')] });
    }
  }
};
