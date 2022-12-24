const redis = require('redis');
const logger = require("../../loggers/logger");
const { SchemaFieldTypes } = require("redis");

class RedisClient {
  constructor() {

  }

  getInstance() {
    return this.redisClient;
  }

  async setup() {
    this.redisClient = redis.createClient();

    this.redisClient.on('connect', () => {
      logger.info(`Redis Connected successfully!`.bgMagenta);
    });

    this.redisClient.on('error', (err) => {
      logger.error("Failed to connect to Redis", err);
    })

    await this.redisClient.connect();

    // Reset Redis Cache
    await this.redisClient.flushAll();

    await this.createIndices();
  }

  async createIndices() {
    // Create connection index
    try {
      await this.redisClient.ft.create("idx:connProfileId", {
        profileId: SchemaFieldTypes.TEXT,
      }, {
        ON: 'HASH',
        PREFIX: 'CONN:'
      });

      // Create Association index
      await this.redisClient.ft.create("idx:assDoctorId", {
        doctorId: SchemaFieldTypes.TEXT,
      }, {
        ON: 'HASH',
        PREFIX: 'DP_ASS:'
      });

    } catch (err) {
      if (err.message === 'Index already exists') {
        logger.info('Redis Index exists already, skipped creation.');
      } else {
        logger.error(err);
      }
    }
  }
}

module.exports =  new RedisClient();
