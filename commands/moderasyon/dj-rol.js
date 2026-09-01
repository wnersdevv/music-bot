const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dj-rol')
    .setDescription('DJ rolünü ayarlar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addRoleOption((o) => o.setName('rol').setDescription('DJ rolü').setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    await GuildMusicSettings.updateOne({ guildId: interaction.guildId }, { djRoleId: role.id }, { upsert: true });
    await interaction.reply({ embeds: [successEmbed(`DJ rolü **${role.name}** olarak ayarlandı.`)], ephemeral: true });
  }
};
