const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed, baseEmbed } = require('../../utils/embeds');

const activeVotes = new Map();

module.exports = {
  data: new SlashCommandBuilder().setName('geç-oylaması').setDescription('Çalan şarkıyı geçmek için oylama başlatır'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const voiceMembers = queue.channel.members.filter((m) => !m.user.bot);
    const requiredVotes = Math.ceil(voiceMembers.size * 0.5);

    let vote = activeVotes.get(interaction.guildId);
    if (!vote || vote.trackUrl !== queue.currentTrack.url) {
      vote = { trackUrl: queue.currentTrack.url, voters: new Set() };
      activeVotes.set(interaction.guildId, vote);
    }

    if (vote.voters.has(interaction.user.id)) {
      return interaction.reply({ embeds: [errorEmbed('Zaten oy verdin.')], ephemeral: true });
    }

    vote.voters.add(interaction.user.id);

    if (vote.voters.size >= requiredVotes) {
      const skipped = queue.currentTrack.title;
      queue.node.skip();
      activeVotes.delete(interaction.guildId);
      return interaction.reply({ embeds: [successEmbed(`Oylama başarılı! **${skipped}** geçildi.`)] });
    }

    await interaction.reply({
      embeds: [baseEmbed().setTitle('🗳️ Geç Oylaması').setDescription(`${vote.voters.size}/${requiredVotes} oy toplandı.`)]
    });
  }
};
