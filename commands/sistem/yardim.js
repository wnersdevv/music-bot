const { SlashCommandBuilder } = require('discord.js');
const { buildHelpPanel } = require('../../components/menus/helpMenuData');

module.exports = {
  data: new SlashCommandBuilder().setName('yardım').setDescription('Bot komutlarını ve kategorilerini gösterir'),

  async execute(interaction) {
    const panel = buildHelpPanel('muzik');
    await interaction.reply({ components: [panel], flags: 1 << 15 });
  }
};
