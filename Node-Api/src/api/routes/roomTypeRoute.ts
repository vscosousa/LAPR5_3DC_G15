import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IRoomTypeController from '../../controllers/IControllers/IRoomTypeController';
import winston from 'winston';
import checkRole from '../middlewares/checkRole';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
    app.use('/room-types', route);

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'combined.log' })
        ],
    });

    const MAX_NAME_LENGTH = 100;

    const ctrl = Container.get(config.controllers.roomType.name) as IRoomTypeController;

    route.post(
        '/create',
        isAuth,
        checkRole(['Admin']),
        celebrate({
            body: Joi.object({
                typeName: Joi.string().max(MAX_NAME_LENGTH).required().messages({
                    'string.max': `Room type name cannot exceed ${MAX_NAME_LENGTH} characters`,
                    'string.empty': 'Room type name is required.',
                }),
            }),
        }),
        async (req: any, res: any, next: any) => {
            logger.info('Received request to create room type:', req.body);
            try {
                await ctrl.createRoomType(req, res, next);
                logger.info('Successfully created room type');
            } catch (error) {
                logger.error('Error creating room type:', error);
                next(error);
            }
        }
    );

    route.get(
        '/',
        isAuth,
        checkRole(['Admin', 'Doctor']),
        async (req, res, next) => {
            logger.info('Received request to get room types');
            try {
                await ctrl.getRoomTypes(req, res, next);
                logger.info('Successfully retrieved room types');
            } catch (error) {
                logger.error('Error retrieving room types:', error);
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
                typeName: Joi.string().max(MAX_NAME_LENGTH).optional().messages({
                    'string.max': `Room type name cannot exceed ${MAX_NAME_LENGTH} characters`,
                }),
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req: any, res: any, next: any) => {
            logger.info('Received request to update room type:', req.params.id);
            try {
                await ctrl.updateRoomType(req, res, next);
                logger.info('Successfully updated room type');
            } catch (error) {
                logger.error('Error updating room type:', error);
                next(error);
            }
        }
    );
};