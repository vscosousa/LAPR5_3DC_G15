import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';


export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const appointmentSchema = {
    name: 'appointmentSchema',
    schema: '../persistence/schemas/appointmentSchema',
  };

  const patientMedicalHistorySchema = {
    name: 'patientMedicalHistorySchema',
    schema: '../persistence/schemas/patientMedicalHistorySchema',
  };

  const specializationSchema = {
    name: 'specializationSchema',
    schema: '../persistence/schemas/specializationSchema',
  };

  const allergySchema = {
    name: 'allergySchema',
    schema: '../persistence/schemas/allergySchema',
  };

  const medicalConditionSchema = {
    name: 'medicalConditionSchema',
    schema: '../persistence/schemas/medicalConditionSchema',
  };

  const appointmentController = {
    name: config.controllers.appointment.name,
    path: config.controllers.appointment.path
  };

  const patientMedicalHistoryController = {
    name: config.controllers.patientMedicalHistory.name,
    path: config.controllers.patientMedicalHistory.path
  };
  
  const specializationController = {
    name: config.controllers.specialization.name,
    path: config.controllers.specialization.path
  };

  const allergyController = {
    name: config.controllers.allergy.name,
    path: config.controllers.allergy.path
  };

  const medicalConditionController = {
    name: config.controllers.medicalCondition.name,
    path: config.controllers.medicalCondition.path
  };

  const appointmentRepo = {
    name: config.repos.appointment.name,
    path: config.repos.appointment.path
  };

  const patientMedicalHistoryRepo = {
    name: config.repos.patientMedicalHistory.name,
    path: config.repos.patientMedicalHistory.path
  };

  const specializationRepo = {
    name: config.repos.specialization.name,
    path: config.repos.specialization.path
  };

  const allergyRepo = {
    name: config.repos.allergy.name,
    path: config.repos.allergy.path
  };

  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name,
    path: config.repos.medicalCondition.path
  };

  const appointmentService = {
    name: config.services.appointment.name,
    path: config.services.appointment.path
  };

  const patientMedicalHistoryService = {
    name: config.services.patientMedicalHistory.name,
    path: config.services.patientMedicalHistory.path
  };

  const specializationService = {
    name: config.services.specialization.name,
    path: config.services.specialization.path
  };

  const allergyService = {
    name: config.services.allergy.name,
    path: config.services.allergy.path
  };

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      appointmentSchema,
      patientMedicalHistorySchema,
      specializationSchema,
      allergySchema,
      medicalConditionSchema
    ],
    controllers: [
      appointmentController,
      patientMedicalHistoryController,
      specializationController,
      allergyController,
      medicalConditionController
    ],
    repos: [
      appointmentRepo,
      patientMedicalHistoryRepo,
      specializationRepo,
      allergyRepo,
      medicalConditionRepo
    ],
    services: [
      appointmentService,
      patientMedicalHistoryService,
      specializationService,
      allergyService,
      medicalConditionService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
