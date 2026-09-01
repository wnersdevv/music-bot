const { t } = require('../services/i18n');
const GuildMusicSettings = require('../database/models/GuildMusicSettings');

async function ensureInVoice(interaction) {
  const member = interaction.member;
  if (!member.voice.channelId) {
    return { ok: false, message: await t(interaction.guildId, 'music.notInVoice') };
  }
  return { ok: true };
}

async function ensureSameVoice(interaction, player) {
  const queue = player.nodes.get(interaction.guildId);
  if (queue && queue.channel && interaction.member.voice.channelId !== queue.channel.id) {
    return { ok: false, message: await t(interaction.guildId, 'music.notSameVoice') };
  }
  return { ok: true };
}

async function ensureDjOrPermission(interaction) {
  if (interaction.member.permissions.has('ManageGuild')) return { ok: true };

  const settings = await GuildMusicSettings.findOne({ guildId: interaction.guildId }).lean();
  if (!settings?.djRoleId) return { ok: true };

  const hasRole = interaction.member.roles.cache.has(settings.djRoleId);
  if (!hasRole) {
    return { ok: false, message: await t(interaction.guildId, 'errors.djOnly') };
  }
  return { ok: true };
}

module.exports = { ensureInVoice, ensureSameVoice, ensureDjOrPermission };
