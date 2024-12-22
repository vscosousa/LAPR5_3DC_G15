import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IAllergyController from '../../controllers/IControllers/IAllergyController';
import winston from 'winston';
import isAuth from '../middlewares/isAuth';
import checkRole from '../middlewares/checkRole';

const route = Router();

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

const logRequestBody = (req: { body: any; }, res: any, next: () => void) => {
    logger.info('Request body:', { body: req.body });
    next();
};

export default (app: Router) => {
    app.use('/allergies', route);

    const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;


    route.post(
        '/create',
        isAuth,
        checkRole(['Admin']),
        logRequestBody,
        celebrate({
            body: Joi.object({
                allergyCode: Joi.string()
                .pattern(/^[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}$|^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9]((\.?[A-HJ-NP-Z0-9]{1,2})?)$/)
                .required()
                .messages({
                    'string.pattern.base': 'Invalid ICD code format. Ensure it matches ICD-10 or ICD-11 standards.',
                    'string.empty': 'Allergy code is required.',
                }),
                allergyName: Joi.string().max(MAX_NAME_LENGTH).required().messages({
                    'string.max': `Allergy name cannot exceed ${MAX_NAME_LENGTH} characters`
                }),
                allergyDescription: Joi.string().max(MAX_DESCRIPTION_LENGTH).required().messages({
                    'string.max': `Allergy description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
                }),
                allergySymptoms: Joi.string().required()
            }),
        }),
        async (req, res, next) => {
            try {
                logger.info('POST /allergies/create called', { body: req.body });
                await ctrl.createAllergy(req, res, next);
            } catch (error) {
                logger.error('Error in POST /allergies/create', { error });
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        isAuth,
        checkRole(['Admin']),
        logRequestBody,
        celebrate({
            body: Joi.object({
                allergyCode: Joi.string()
                .pattern(/^[A-TV-Z][0-9][0-9AB]\.?[0-9A-TV-Z]{0,4}$|^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9]((\.?[A-HJ-NP-Z0-9]{1,2})?)$/)
                .optional()
                .messages({
                    'string.pattern.base': 'Invalid ICD code format. Ensure it matches ICD-10 or ICD-11 standards.',
                    'string.empty': 'Allergy code is required.',
                }),
                allergyName: Joi.string().max(MAX_NAME_LENGTH).optional().messages({
                    'string.max': `Allergy name cannot exceed ${MAX_NAME_LENGTH} characters`
                }),
                allergyDescription: Joi.string().max(MAX_DESCRIPTION_LENGTH).optional().messages({
                    'string.max': `Allergy description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
                }),
                allergySymptoms: Joi.string().optional()
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req, res, next) => {
            try {
                logger.info('PUT /allergies/update/:id called', { body: req.body, params: req.params });
                await ctrl.updateAllergy(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.delete(
        '/delete/:id',
        isAuth,
        checkRole(['Admin']),
        logRequestBody,
        celebrate({
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req, res, next) => {
            try {
                logger.info('DELETE /allergies/delete/:id called', { params: req.params });
                await ctrl.deleteAllergy(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/',
        isAuth,
        checkRole(['Doctor', 'Admin', 'Patient']),
        logRequestBody,
        async (req, res, next) => {
            try {
                logger.info('GET /allergies called');
                await ctrl.listAllergies(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};