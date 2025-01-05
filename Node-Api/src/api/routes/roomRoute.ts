import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IRoomController from '../../controllers/IControllers/IRoomController';
import winston from 'winston';
import checkRole from '../middlewares/checkRole';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/rooms', route);

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'combined.log' })
    ],
  });

  const MAX_ROOM_NUMBER_LENGTH = 10;
  const MAX_ROOM_TYPE_LENGTH = 100;

  const ctrl = Container.get(config.controllers.room.name) as IRoomController;

  route.post(
    '/create',
    isAuth,
    checkRole(['Admin']),
    celebrate({
      body: Joi.object({
        roomNumber: Joi.string().max(MAX_ROOM_NUMBER_LENGTH).required().messages({
          'string.max': `Room number cannot exceed ${MAX_ROOM_NUMBER_LENGTH} characters`,
          'string.empty': 'Room number is required.',
        }),
        roomType: Joi.string().max(MAX_ROOM_TYPE_LENGTH).required().messages({
          'string.max': `Room type cannot exceed ${MAX_ROOM_TYPE_LENGTH} characters`,
          'string.empty': 'Room type is required.',
        }),
      }),
    }),
    async (req: any, res: any, next: any) => {
      logger.info('Received request to create room:', req.body);
      try {
        await ctrl.createRoom(req, res, next);
        logger.info('Successfully created room');
      } catch (error) {
        logger.error('Error creating room:', error);
        next(error);
      }
    }
  );

  route.get(
    '/',
    isAuth,
    checkRole(['Admin']),
    async (req: any, res: any, next: any) => {
      logger.info('Received request to get all rooms');
      try {
        await ctrl.getRooms(req, res, next);
        logger.info('Successfully retrieved all rooms');
      } catch (error) {
        logger.error('Error retrieving rooms:', error);
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
        roomNumber: Joi.string().max(MAX_ROOM_NUMBER_LENGTH).required().messages({
          'string.max': `Room number cannot exceed ${MAX_ROOM_NUMBER_LENGTH} characters`,
          'string.empty': 'Room number is required.',
        }),
        roomType: Joi.string().max(MAX_ROOM_TYPE_LENGTH).required().messages({
          'string.max': `Room type cannot exceed ${MAX_ROOM_TYPE_LENGTH} characters`,
          'string.empty': 'Room type is required.',
        }),
      }),
    }),
    async (req: any, res: any, next: any) => {
      logger.info('Received request to update room:', req.body);
      try {
        await ctrl.updateRoom(req, res, next);
        logger.info('Successfully updated room');
      } catch (error) {
        logger.error('Error updating room:', error);
        next(error);
      }
    }
  );
};