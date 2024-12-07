import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL);
  const db = connection.connection.db as any;
  db.timeoutMS = config.timeoutMS || 30000;
  return db;
};
