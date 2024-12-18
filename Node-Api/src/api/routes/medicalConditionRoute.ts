import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';
import winston from 'winston';
import checkRole from '../middlewares/checkRole';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
    app.use('/medicalConditions', route);

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'combined.log' })
        ],
    });

    const MAX_NAME_LENGTH = 100;
    const MAX_DESCRIPTION_LENGTH = 2048;

    const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;


    route.post(
        '/create',
        isAuth,
        checkRole(['Admin']),
        celebrate({
            body: Joi.object({
                medicalConditionCode: Joi.string()
                    .pattern(/^[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}$|^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9]((\.?[A-HJ-NP-Z0-9]{1,2})?)$/)
                    .required()
                    .messages({
                        'string.pattern.base': 'Invalid ICD code format. Ensure it matches ICD-10 or ICD-11 standards.',
                        'string.empty': 'Medical condition code is required.',
                    }),
                medicalConditionName: Joi.string().max(MAX_NAME_LENGTH).required().messages({
                    'string.max': `Allergy name cannot exceed ${MAX_NAME_LENGTH} characters`
                }),
                medicalConditionDescription: Joi.string().max(MAX_DESCRIPTION_LENGTH).required().messages({
                    'string.max': `Allergy description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
                }),
                medicalConditionSymptoms: Joi.string().required()
            }),
        }),
        async (req: any, res: any, next: any) => {
            logger.info('Received request to create medical condition:', req.body);
            try {
                await ctrl.createMedicalCondition(req, res, next);
                logger.info('Successfully created medical condition');
            } catch (error) {
                logger.error('Error creating medical condition:', error);
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        isAuth,
        checkRole(['Admin']),
        celebrate({
            body: Joi.object({
                medicalConditionCode: Joi.string()
                    .pattern(/^[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}$|^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9]((\.?[A-HJ-NP-Z0-9]{1,2})?)$/)
                    .optional()
                    .messages({
                        'string.pattern.base': 'Invalid ICD code format. Ensure it matches ICD-10 or ICD-11 standards.',
                        'string.empty': 'Medical condition code is required.',
                    }),
                medicalConditionName: Joi.string().max(MAX_NAME_LENGTH).optional().messages({
                    'string.max': `Allergy name cannot exceed ${MAX_NAME_LENGTH} characters`
                }),
                medicalConditionDescription: Joi.string().max(MAX_DESCRIPTION_LENGTH).optional().messages({
                    'string.max': `Allergy description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
                }),
                medicalConditionSymptoms: Joi.string().optional()
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.updateMedicalCondition(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.delete(
        '/delete/:id',
        isAuth,
        checkRole(['Admin']),
        celebrate({
            params: Joi.object({
                id: Joi.string().required(), // Validate the medicalCondition ID
            }),
        }),
        async (req, res, next) => {
            try {
                await ctrl.deleteMedicalCondition(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/',
        isAuth,
        checkRole(['Doctor', 'Admin']),
        async (req: any, res: any, next: any) => {
            try {
                logger.info('GET /medicalConditions called');
                await ctrl.listMedicalConditions(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};