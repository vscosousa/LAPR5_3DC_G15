import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IAllergyController from '../../controllers/IControllers/IAllergyController';
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

const logRequestBody = (req: { body: any; }, res: any, next: () => void) => {
    logger.info('Request body:', { body: req.body });
    next();
};

export default (app: Router) => {
    app.use('/allergies', route);

    const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;

    route.post(
        '/create',
        logRequestBody,
        celebrate({
            body: Joi.object({
                allergyName: Joi.string().required()
            }),
        }),
        async (req, res, next) => {
            try {
                logger.info('POST /allergies/create called', { body: req.body });
                await ctrl.createAllergy(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        logRequestBody,
        celebrate({
            body: Joi.object({
                allergyName: Joi.string().required()
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