import { config } from '@users/config';
import { winstonLogger } from '@jahidhiron/jobber-shared';
import { Channel } from 'amqplib';
import { createConnection } from '@users/queues/connection';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));

    log.info(logMessage);
  } catch (error) {
    log.log('error', 'UsersService publishDirectMessage() method error:', error);
  }
};
