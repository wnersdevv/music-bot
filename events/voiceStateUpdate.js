const { getPlayer } = require('../music/player');
const GuildMusicSettings = require('../database/models/GuildMusicSettings');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const guild = oldState.guild || newState.guild;
    const player = getPlayer();
    const queue = player.nodes.get(guild.id);
    if (!queue || !queue.channel) return;

    const humansLeft = queue.channel.members.filter((m) => !m.user.bot).size;
    if (humansLeft > 0) return;

    const settings = await GuildMusicSettings.findOne({ guildId: guild.id }).lean();
    if (settings?.twentyFourSeven) return;

    setTimeout(() => {
      const stillEmpty = queue.channel.members.filter((m) => !m.user.bot).size === 0;
      if (stillEmpty) queue.delete();
    }, 60_000);
  }
};
