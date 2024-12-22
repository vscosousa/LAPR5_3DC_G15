import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IPatientMedicalHistoryController from '../../controllers/IControllers/IPatientMedicalHistory';
import winston from 'winston';
import checkRole from '../middlewares/checkRole';
import isAuth from '../middlewares/isAuth';

const route = Router();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

const logRequestBody = (req: { body: any; }, res: any, next: () => void) => {
  logger.info('Request body:', { body: req.body });
  next();
};

export default (app: Router) => {
  app.use('/patientsMedicalHistory', route);

  const ctrl = Container.get(config.controllers.patientMedicalHistory.name) as IPatientMedicalHistoryController;

  const arrayWithEmptyStringToEmptyArray = (value: any, helpers: any) => {
    if (value.length === 1 && value[0] === '') {
      return [];
    }
    return value;
  };

  route.post(
    '/create',
    logRequestBody,
    celebrate({
      body: Joi.object({
        patientMedicalRecordNumber: Joi.string().required(),
        medicalConditions: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        allergies: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        familyHistory: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        freeText: Joi.string().optional().allow(''),
      }),
    }),
    async (req, res, next) => {
      try {
        logger.info('POST /patientsMedicalHistory/create called', { body: req.body });
        console.log('Request received at /patientsMedicalHistory/create');
        await ctrl.createPatientMedicalHistory(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );

  route.put(
    '/update/:patientMedicalRecordNumber',
    isAuth,
    checkRole(['Doctor']),
    logRequestBody,
    celebrate({
      body: Joi.object({
        medicalConditions: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        allergies: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        familyHistory: Joi.array().items(Joi.string()).optional().default([]).custom(arrayWithEmptyStringToEmptyArray),
        freeText: Joi.string().optional().allow(''),
      }),
      params: Joi.object({
        patientMedicalRecordNumber: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        logger.info('PUT /patientsMedicalHistory/update/:patientMedicalRecordNumber called', { body: req.body, params: req.params });
        console.log('Request received at /patientsMedicalHistory/update/:patientMedicalRecordNumber');
        await ctrl.updatePatientMedicalHistory(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );

  route.get(
    '/get/:patientMedicalRecordNumber',
    isAuth,
    checkRole(['Doctor', 'Admin', 'Patient']),
    logRequestBody,
    celebrate({
      params: Joi.object({
        patientMedicalRecordNumber: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        logger.info('GET /patientsMedicalHistory/get/:patientMedicalRecordNumber called', { params: req.params });
        console.log('Request received at /patientsMedicalHistory/get/:patientMedicalRecordNumber');
        await ctrl.getPatientMedicalHistory(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );
};