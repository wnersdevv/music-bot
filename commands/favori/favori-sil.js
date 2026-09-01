const { SlashCommandBuilder } = require('discord.js');
const Favorite = require('../../database/models/Favorite');
const { errorEmbed, successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('favori-sil')
    .setDescription('Favorilerinden bir şarkıyı siler')
    .addStringOption((opt) =>
      opt.setName('şarkı').setDescription('Silinecek şarkı').setRequired(true).setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const favorites = await Favorite.find({ userId: interaction.user.id, title: new RegExp(focused, 'i') })
      .limit(20)
      .lean();

    await interaction.respond(favorites.map((f) => ({ name: f.title.slice(0, 100), value: f.url.slice(0, 100) })));
  },

  async execute(interaction) {
    const url = interaction.options.getString('şarkı');
    const deleted = await Favorite.findOneAndDelete({ userId: interaction.user.id, url });

    if (!deleted) {
      return interaction.reply({ embeds: [errorEmbed('Bu şarkı favorilerinde bulunamadı.')], ephemeral: true });
    }

    await interaction.reply({ embeds: [successEmbed(`**${deleted.title}** favorilerden silindi.`)], ephemeral: true });
  }
};
