import { databaseConnection } from '@users/database';
import { config } from '@users/config';
import express from 'express';
import { start } from '@users/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app = express();
  start(app);
};

initilize();
