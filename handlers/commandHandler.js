const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const categories = fs.readdirSync(commandsPath);

  let count = 0;
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      const command = require(path.join(categoryPath, file));
      if (!command?.data?.name) {
        logger.warn('CommandHandler', `Geçersiz komut atlandı: ${category}/${file}`);
        continue;
      }
      command.category = category;
      client.commands.set(command.data.name, command);
      count++;
    }
  }

  logger.success('CommandHandler', `${count} komut yüklendi.`);
}

module.exports = { loadCommands };
