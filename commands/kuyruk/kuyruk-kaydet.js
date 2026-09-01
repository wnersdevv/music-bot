const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const Playlist = require('../../database/models/Playlist');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyruk-kaydet')
    .setDescription('Mevcut kuyruğu playlist olarak kaydeder')
    .addStringOption((o) => o.setName('isim').setDescription('Playlist adı').setRequired(true)),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    const name = interaction.options.getString('isim');

    if (!queue?.tracks?.size) {
      return interaction.reply({ embeds: [errorEmbed('Kuyruk boş, kaydedilecek bir şey yok.')], ephemeral: true });
    }

    const exists = await Playlist.findOne({ userId: interaction.user.id, name });
    if (exists) {
      return interaction.reply({ embeds: [errorEmbed('Bu isimde bir playlistin zaten var.')], ephemeral: true });
    }

    const tracks = queue.tracks.toArray().map((t) => ({
      title: t.title, url: t.url, duration: t.duration, thumbnail: t.thumbnail
    }));

    await Playlist.create({ userId: interaction.user.id, name, tracks });
    await interaction.reply({ embeds: [successEmbed(`Kuyruk **${name}** olarak kaydedildi (${tracks.length} şarkı).`)] });
  }
};
