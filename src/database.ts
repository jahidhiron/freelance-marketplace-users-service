import { winstonLogger } from '@jahidhiron/jobber-shared';
import { config } from '@users/config';
import mongoose from 'mongoose';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersDatabaseServer', 'debug');

export const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Users service successfully connected to database.');
  } catch (error) {
    log.log('error', 'UsersService databaseConnection() method error:', error);
  }
};
