import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const appointmentSchema = {
    name: 'appointmentSchema',
    schema: '../persistence/schemas/appointmentSchema',
  };

  const appointmentController = {
    name: config.controllers.appointment.name,
    path: config.controllers.appointment.path
  };

  const appointmentRepo = {
    name: config.repos.appointment.name,
    path: config.repos.appointment.path
  };

  const appointmentService = {
    name: config.services.appointment.name,
    path: config.services.appointment.path
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      appointmentSchema
    ],
    controllers: [
      appointmentController
    ],
    repos: [
      appointmentRepo
    ],
    services: [
      appointmentService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
