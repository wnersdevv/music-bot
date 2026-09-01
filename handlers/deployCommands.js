const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config/config');
const logger = require('../utils/logger');

async function deploy() {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const categories = fs.readdirSync(commandsPath);
  const payload = [];

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    for (const file of fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'))) {
      const command = require(path.join(categoryPath, file));
      if (command?.data) payload.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationCommands(config.clientId), { body: payload });
  logger.success('Deploy', `${payload.length} slash komut deploy edildi.`);
}

deploy().catch((err) => logger.error('Deploy', err.stack));
