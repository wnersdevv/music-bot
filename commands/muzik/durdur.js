const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../utils/embeds');
const { ensureDjOrPermission } = require('../../utils/voiceGuard');

module.exports = {
  data: new SlashCommandBuilder().setName('durdur').setDescription('Müziği durdurur ve kuyruğu temizler'),

  async execute(interaction) {
    const queue = useQueue(interaction.guildId);
    if (!queue?.currentTrack) {
      return interaction.reply({ embeds: [errorEmbed('Şu an çalan bir şarkı yok.')], ephemeral: true });
    }

    const permCheck = await ensureDjOrPermission(interaction);
    if (!permCheck.ok) {
      return interaction.reply({ embeds: [errorEmbed(permCheck.message)], ephemeral: true });
    }

    queue.delete();
    await interaction.reply({ embeds: [successEmbed('Müzik durduruldu ve kuyruk temizlendi.')] });
  }
};
