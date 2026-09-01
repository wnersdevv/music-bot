const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kuyruk-sırala')
    .setDescription('Kuyruğu alfabetik olarak sıralar')
    .addStringOption((o) =>
      o.setName('yön').setDescription('Sıralama yönü').setRequired(false)
        .addChoices({ name: 'A-Z', value: 'asc' }, { name: 'Z-A', value: 'desc' })
    ),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.tracks?.size) {
      return interaction.reply({ embeds: [errorEmbed('Kuyruk boş.')], ephemeral: true });
    }

    const dir = interaction.options.getString('yön') || 'asc';
    const sorted = [...queue.tracks.toArray()].sort((a, b) =>
      dir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

    queue.tracks.clear();
    queue.tracks.add(sorted);

    await interaction.reply({ embeds: [successEmbed('Kuyruk sıralandı.')] });
  }
};
