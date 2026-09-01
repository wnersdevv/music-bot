const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('sesli').setDescription('Botun sesini geri açar'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const settings = await GuildMusicSettings.findOne({ guildId: interaction.guildId }).lean();
    const volume = settings?.defaultVolume || 80;

    queue.node.setVolume(volume);
    await interaction.reply({ embeds: [successEmbed(`🔊 Ses %${volume} olarak geri açıldı.`)] });
  }
};
