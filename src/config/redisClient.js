const Redis = require('redis');
const { redis } = require('./config');

const url = `redis://${redis.host}:${redis.port}`;
const client = Redis.createClient({ url });
if (redis.usePassword.toUpperCase() === 'YES') {
    client.auth(redis.password);
}
client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});
(async () => {
  try {
    await client.connect(); // ✅ THIS IS CRUCIAL
    console.log('✅ Redis client connected successfully!');
  } catch (err) {
    console.error('❌ Failed to connect Redis:', err);
  }
})();

module.exports = client;
