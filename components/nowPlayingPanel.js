const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SectionBuilder,
  ThumbnailBuilder
} = require('discord.js');
const emojis = require('../emojis');
const config = require('../config/config');

function buildNowPlayingPanel(track, queue) {
  const container = new ContainerBuilder().setAccentColor(config.colors.primary);

  const header = new TextDisplayBuilder().setContent(
    `### ${emojis.music} Şu An Çalıyor\n**${track.title}**\n${track.author ?? ''}`
  );

  const section = new SectionBuilder()
    .addTextDisplayComponents(header)
    .setThumbnailAccessory(
      new ThumbnailBuilder().setURL(track.thumbnail || 'https://i.imgur.com/9UM9x0S.png')
    );

  container.addSectionComponents(section);
  container.addSeparatorComponents(new SeparatorBuilder());

  const info = new TextDisplayBuilder().setContent(
    `⏱️ \`${track.duration}\`  •  🔁 \`${queue?.repeatMode ?? 0}\`  •  🔊 \`${queue?.node?.volume ?? 80}%\``
  );
  container.addTextDisplayComponents(info);

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player:prev').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:pauseresume').setEmoji(emojis.pause).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('player:skip').setEmoji(emojis.skip).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:stop').setEmoji(emojis.stop).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('player:shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player:voldown').setEmoji('🔉').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:volup').setEmoji('🔊').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:queue').setEmoji(emojis.queue).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:favorite').setEmoji(emojis.favorite).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player:loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary)
  );

  container.addActionRowComponents(row1, row2);
  return container;
}

module.exports = { buildNowPlayingPanel };
