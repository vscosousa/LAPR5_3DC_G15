import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IPatientMedicalHistoryController from '../../controllers/IControllers/IPatientMedicalHistory';
import winston from 'winston';

const route = Router();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

const logRequestBody = (req, res, next) => {
  logger.info('Request body:', { body: req.body });
  next();
};

export default (app: Router) => {
  app.use('/patientsMedicalHistory', route);

  const ctrl = Container.get(config.controllers.patientMedicalHistory.name) as IPatientMedicalHistoryController;

  route.post(
    '/create',
    logRequestBody,
    celebrate({
      body: Joi.object({
        patientMedicalRecordNumber: Joi.string().required(),
        medicalConditions: Joi.array().items(Joi.string()).optional(),
        allergies: Joi.array().items(Joi.string()).optional(),
      }),
    }),
    (req, res, next) => {
      logger.info('POST /patientsMedicalHistory/create called', { body: req.body });
      console.log('Request received at /patientsMedicalHistory/create');
      ctrl.createPatientMedicalHistory(req, res, next);
    }
  );

  route.put(
    '/update/:id',
    logRequestBody,
    celebrate({
      body: Joi.object({
        medicalConditions: Joi.string().optional(),
        allergies: Joi.string().optional(),
      }),
      params: Joi.object({
        patientMedicalRecordNumber: Joi.string().required(),
      }),
    }),
    (req, res, next) => {
      logger.info('PUT /patientsMedicalHistory/update/:id called', { body: req.body, params: req.params });
      ctrl.updatePatientMedicalHistory(req, res, next);
    }
  );
};