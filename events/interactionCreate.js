const logger = require('../utils/logger');
const { errorEmbed } = require('../utils/embeds');
const { handleButton } = require('../components/buttons/buttonRouter');
const { handleMenu } = require('../components/menus/menuRouter');

const COOLDOWN_MS = 2000;

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) return handleCommand(interaction, client);
      if (interaction.isButton()) return handleButton(interaction, client);
      if (interaction.isAnySelectMenu()) return handleMenu(interaction, client);
    } catch (err) {
      logger.error('InteractionCreate', err.stack);
      const payload = { embeds: [errorEmbed('Beklenmeyen bir hata oluştu.')], ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  }
};

async function handleCommand(interaction, client) {
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const cooldownKey = `${interaction.user.id}:${command.data.name}`;
  const lastUsed = client.cooldowns.get(cooldownKey);
  if (lastUsed && Date.now() - lastUsed < COOLDOWN_MS) {
    return interaction.reply({
      embeds: [errorEmbed('Çok hızlısın, birkaç saniye bekle.')],
      ephemeral: true
    });
  }
  client.cooldowns.set(cooldownKey, Date.now());

  await command.execute(interaction, client);
}
