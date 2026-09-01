const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildMusicSettings = require('../../database/models/GuildMusicSettings');
const GuildModel = require('../../database/models/Guild');
const { successEmbed, baseEmbed } = require('../../utils/embeds');
const { setGuildLanguageCache } = require('../../services/i18n');

async function getOrCreateSettings(guildId) {
  let settings = await GuildMusicSettings.findOne({ guildId });
  if (!settings) settings = await GuildMusicSettings.create({ guildId });
  return settings;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayarlar')
    .setDescription('Sunucu müzik ayarlarını yönetir')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub.setName('dil').setDescription('Bot dilini ayarlar')
        .addStringOption((o) => o.setName('dil').setDescription('Dil').setRequired(true)
          .addChoices({ name: 'Türkçe', value: 'tr' }, { name: 'English', value: 'en' }))
    )
    .addSubcommand((sub) =>
      sub.setName('dj').setDescription('DJ rolünü ayarlar')
        .addRoleOption((o) => o.setName('rol').setDescription('DJ rolü').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('24-7').setDescription('7/24 modunu açar/kapatır')
        .addBooleanOption((o) => o.setName('durum').setDescription('Açık/Kapalı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('otomatik-oynat').setDescription('Otomatik oynatmayı açar/kapatır')
        .addBooleanOption((o) => o.setName('durum').setDescription('Açık/Kapalı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('ses').setDescription('Varsayılan ses seviyesini ayarlar')
        .addIntegerOption((o) => o.setName('seviye').setDescription('0-100').setMinValue(0).setMaxValue(100).setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('döngü').setDescription('Varsayılan döngü modunu ayarlar')
        .addStringOption((o) => o.setName('mod').setDescription('Döngü modu').setRequired(true)
          .addChoices({ name: 'Kapalı', value: 'off' }, { name: 'Şarkı', value: 'track' }, { name: 'Kuyruk', value: 'queue' }))
    )
    .addSubcommand((sub) =>
      sub.setName('kuyruk').setDescription('Maksimum kuyruk boyutunu ayarlar')
        .addIntegerOption((o) => o.setName('maks').setDescription('Maksimum şarkı sayısı').setMinValue(10).setMaxValue(1000).setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('istek').setDescription('Şarkı istek kanalını ayarlar')
        .addChannelOption((o) => o.setName('kanal').setDescription('Metin kanalı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('duyuru').setDescription('Duyuru kanalını ayarlar')
        .addChannelOption((o) => o.setName('kanal').setDescription('Metin kanalı').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('göster').setDescription('Mevcut ayarları gösterir')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (sub === 'dil') {
      const lang = interaction.options.getString('dil');
      await GuildModel.findOneAndUpdate({ guildId }, { language: lang }, { upsert: true });
      setGuildLanguageCache(guildId, lang);
      return interaction.reply({ embeds: [successEmbed('Dil ayarlandı.')], ephemeral: true });
    }

    if (sub === 'dj') {
      const role = interaction.options.getRole('rol');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { djRoleId: role.id });
      return interaction.reply({ embeds: [successEmbed(`DJ rolü **${role.name}** olarak ayarlandı.`)], ephemeral: true });
    }

    if (sub === '24-7') {
      const state = interaction.options.getBoolean('durum');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { twentyFourSeven: state });
      return interaction.reply({ embeds: [successEmbed(`7/24 modu ${state ? 'açıldı' : 'kapatıldı'}.`)], ephemeral: true });
    }

    if (sub === 'otomatik-oynat') {
      const state = interaction.options.getBoolean('durum');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { autoplay: state });
      return interaction.reply({ embeds: [successEmbed(`Otomatik oynatma ${state ? 'açıldı' : 'kapatıldı'}.`)], ephemeral: true });
    }

    if (sub === 'ses') {
      const level = interaction.options.getInteger('seviye');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { defaultVolume: level });
      return interaction.reply({ embeds: [successEmbed(`Varsayılan ses %${level} olarak ayarlandı.`)], ephemeral: true });
    }

    if (sub === 'döngü') {
      const mode = interaction.options.getString('mod');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { loopMode: mode });
      return interaction.reply({ embeds: [successEmbed(`Varsayılan döngü modu: **${mode}**`)], ephemeral: true });
    }

    if (sub === 'kuyruk') {
      const max = interaction.options.getInteger('maks');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { maxQueueSize: max });
      return interaction.reply({ embeds: [successEmbed(`Maksimum kuyruk boyutu **${max}** olarak ayarlandı.`)], ephemeral: true });
    }

    if (sub === 'istek') {
      const channel = interaction.options.getChannel('kanal');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { requestChannelId: channel.id });
      return interaction.reply({ embeds: [successEmbed(`İstek kanalı ${channel} olarak ayarlandı.`)], ephemeral: true });
    }

    if (sub === 'duyuru') {
      const channel = interaction.options.getChannel('kanal');
      await getOrCreateSettings(guildId);
      await GuildMusicSettings.updateOne({ guildId }, { announceChannelId: channel.id });
      return interaction.reply({ embeds: [successEmbed(`Duyuru kanalı ${channel} olarak ayarlandı.`)], ephemeral: true });
    }

    if (sub === 'göster') {
      const settings = await getOrCreateSettings(guildId);
      const embed = baseEmbed()
        .setTitle('⚙️ Sunucu Ayarları')
        .setDescription(
          `**DJ Rolü:** ${settings.djRoleId ? `<@&${settings.djRoleId}>` : 'Ayarlanmadı'}\n` +
          `**7/24:** ${settings.twentyFourSeven ? 'Açık' : 'Kapalı'}\n` +
          `**Otomatik Oynatma:** ${settings.autoplay ? 'Açık' : 'Kapalı'}\n` +
          `**Varsayılan Ses:** %${settings.defaultVolume}\n` +
          `**Döngü:** ${settings.loopMode}`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
