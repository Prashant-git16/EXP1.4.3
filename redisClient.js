const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  await client.connect();
  console.log("Redis Connected");
}

module.exports = { client, connectRedis };