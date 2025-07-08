const dotenv = require('dotenv');
dotenv.config();

const cache = require('./middleware/cache');

(async () => {
  await cache.flushEnvCache();
  process.exit(0);
})();