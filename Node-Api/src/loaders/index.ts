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

  const specializationSchema = {
    name: 'specializationSchema',
    schema: '../persistence/schemas/specializationSchema',
  }

  const appointmentController = {
    name: config.controllers.appointment.name,
    path: config.controllers.appointment.path
  };
  
  const specializationController = {
    name: config.controllers.specialization.name,
    path: config.controllers.specialization.path
  }

  const appointmentRepo = {
    name: config.repos.appointment.name,
    path: config.repos.appointment.path
  };

  const specializationRepo = {
    name: config.repos.specialization.name,
    path: config.repos.specialization.path
  };

  const appointmentService = {
    name: config.services.appointment.name,
    path: config.services.appointment.path
  };

  const specializationService = {
    name: config.services.specialization.name,
    path: config.services.specialization.path
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      appointmentSchema,
      specializationSchema
    ],
    controllers: [
      appointmentController,
      specializationController
    ],
    repos: [
      appointmentRepo,
      specializationRepo

    ],
    services: [
      appointmentService,
      specializationService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
