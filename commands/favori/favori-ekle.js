const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const Favorite = require('../../database/models/Favorite');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('favori-ekle').setDescription('Şu an çalan şarkıyı favorilere ekler'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const track = queue.currentTrack;
    await Favorite.findOneAndUpdate(
      { userId: interaction.user.id, url: track.url },
      { title: track.title, url: track.url, duration: track.duration, thumbnail: track.thumbnail },
      { upsert: true }
    );

    await interaction.reply({ embeds: [successEmbed(`**${track.title}** favorilere eklendi.`)], ephemeral: true });
  }
};
