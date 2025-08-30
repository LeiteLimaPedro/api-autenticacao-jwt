const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('connect', () => {
  console.log('✅ Conectado ao Redis');
});

client.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

(async () => {
  await client.connect();
})();

module.exports = client;