const { ActivityType } = require('discord.js');
const config = require('../config/config');
const logger = require('../utils/logger');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    logger.success('Ready', `${client.user.tag} olarak giriş yapıldı. (${config.brand})`);

    client.user.setPresence({
      activities: [{ name: `${config.brand} müzik | /yardım`, type: ActivityType.Listening }],
      status: 'online'
    });
  }
};
