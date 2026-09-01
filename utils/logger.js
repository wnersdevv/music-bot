const levels = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m', success: '\x1b[32m' };
const reset = '\x1b[0m';

function log(level, scope, message) {
  const color = levels[level] || '';
  const time = new Date().toISOString();
  console.log(`${color}[${time}] [${scope}] ${message}${reset}`);
}

module.exports = {
  info: (scope, msg) => log('info', scope, msg),
  warn: (scope, msg) => log('warn', scope, msg),
  error: (scope, msg) => log('error', scope, msg),
  success: (scope, msg) => log('success', scope, msg)
};
