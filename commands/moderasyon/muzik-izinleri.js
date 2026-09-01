const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('müzik-izinleri')
    .setDescription('Kimlerin şarkı isteyebileceğini ayarlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((o) =>
      o.setName('mod').setDescription('İzin modu').setRequired(true)
        .addChoices({ name: 'Herkes', value: 'anyone' }, { name: 'Sadece DJ', value: 'dj-only' })
    ),

  async execute(interaction) {
    const mode = interaction.options.getString('mod');
    await GuildMusicSettings.updateOne({ guildId: interaction.guildId }, { requestMode: mode }, { upsert: true });
    await interaction.reply({ embeds: [successEmbed(`Müzik izin modu: **${mode === 'anyone' ? 'Herkes' : 'Sadece DJ'}**`)], ephemeral: true });
  }
};
