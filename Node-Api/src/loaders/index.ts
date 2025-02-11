import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';
import roomTypeSchema from '../persistence/schemas/roomTypeSchema';


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

  const roomSchema = {
    name: 'roomSchema',
    schema: '../persistence/schemas/roomSchema',
  };

  const roomTypeSchema = {
    name: 'roomTypeSchema',
    schema: '../persistence/schemas/roomTypeSchema',
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

  const roomTypeController = {
    name: config.controllers.roomType.name,
    path: config.controllers.roomType.path
  };

  const roomController = {
    name: config.controllers.room.name,
    path: config.controllers.room.path
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

  const roomTypeRepo = {
    name: config.repos.roomType.name,
    path: config.repos.roomType.path
  };

  const roomRepo = {
    name: config.repos.room.name,
    path: config.repos.room.path
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

  const roomTypeService = {
    name: config.services.roomType.name,
    path: config.services.roomType.path
  };

  const roomService = {
    name: config.services.room.name,
    path: config.services.room.path
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      appointmentSchema,
      patientMedicalHistorySchema,
      specializationSchema,
      allergySchema,
      medicalConditionSchema,
      roomTypeSchema,
      roomSchema
    ],
    controllers: [
      appointmentController,
      patientMedicalHistoryController,
      specializationController,
      allergyController,
      medicalConditionController,
      roomTypeController,
      roomController
    ],
    repos: [
      appointmentRepo,
      patientMedicalHistoryRepo,
      specializationRepo,
      allergyRepo,
      medicalConditionRepo,
      roomTypeRepo,
      roomRepo
    ],
    services: [
      appointmentService,
      patientMedicalHistoryService,
      specializationService,
      allergyService,
      medicalConditionService,
      roomTypeService,
      roomService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
