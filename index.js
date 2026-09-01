const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config/config');
const { connectDatabase } = require('./database/connection/db');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { initPlayer } = require('./music/player');
const { registerPlayerEvents } = require('./music/playerEvents');
const logger = require('./utils/logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.cooldowns = new Collection();

async function bootstrap() {
  try {
    await connectDatabase();
    await initPlayer(client);
    registerPlayerEvents(client);

    loadCommands(client);
    loadEvents(client);

    await client.login(config.token);
  } catch (err) {
    logger.error('Bootstrap', err.stack);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => logger.error('UnhandledRejection', err?.stack || String(err)));
process.on('uncaughtException', (err) => logger.error('UncaughtException', err.stack));

bootstrap();
