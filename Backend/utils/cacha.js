const redisClient = require("../config/redis");

const clearUserTaskCache = async (userId) => {
  const pattern = `tasks:${userId}:*`;

  for await (const key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    await redisClient.del(key);
  }
};

module.exports = {
  clearUserTaskCache,
};
