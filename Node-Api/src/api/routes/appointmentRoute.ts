import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import IAppointmentController from '../../controllers/IControllers/IAppointmentController';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/appointments', route);

  const ctrl = Container.get(config.controllers.appointment.name) as IAppointmentController;

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        requestId: Joi.string().required(),
        roomId: Joi.string().required(),
        dateTime: Joi.date().required(),
        status: Joi.string().valid('scheduled', 'completed', 'canceled').required()
      }),
    }),
    async (req: any, res: any, next: any) => {
      try {
        await ctrl.createAppointment(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );

  route.put(
    '/update/:id',
    celebrate({
      body: Joi.object({
        requestId: Joi.string().required(),
        roomId: Joi.string().required(),
        dateTime: Joi.date().required(),
        status: Joi.string().valid('scheduled', 'completed', 'canceled').required()
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    async (req: any, res: any, next: any) => {
      try {
        await ctrl.updateAppointment(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );
};