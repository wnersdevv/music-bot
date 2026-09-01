const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const History = require('../../database/models/History');
const { buildProfileCard } = require('../../canvas/profileCard');

module.exports = {
  data: new SlashCommandBuilder().setName('profil').setDescription('Müzik profilini gösterir'),

  async execute(interaction) {
    await interaction.deferReply();

    const history = await History.find({ userId: interaction.user.id }).lean();
    const totalListenMs = history.reduce((sum, h) => sum + (h.durationMs || 0), 0);

    const artistCounts = {};
    for (const h of history) {
      if (!h.artist) continue;
      artistCounts[h.artist] = (artistCounts[h.artist] || 0) + 1;
    }
    const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const buffer = await buildProfileCard({
      username: interaction.user.username,
      avatarUrl: interaction.user.displayAvatarURL({ extension: 'png', size: 256 }),
      totalListenMs,
      totalTracksPlayed: history.length,
      topArtist
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'profil.png' });
    await interaction.editReply({ files: [attachment] });
  }
};
