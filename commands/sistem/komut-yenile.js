const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const config = require('../../config/config');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder().setName('komut-yenile').setDescription('Geliştirici: slash komutları yeniden deploy eder'),

  async execute(interaction, client) {
    if (!config.devIds.includes(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Bu komutu kullanma yetkin yok.')], ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const payload = [...client.commands.values()].map((c) => c.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(config.token);
    await rest.put(Routes.applicationCommands(config.clientId), { body: payload });

    await interaction.editReply({ embeds: [successEmbed(`${payload.length} komut yeniden deploy edildi.`)] });
  }
};
