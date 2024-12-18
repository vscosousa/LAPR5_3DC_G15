import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import IAppointmentController from '../../controllers/IControllers/IAppointmentController';
import config from '../../../config';
import checkRole from '../middlewares/checkRole';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/appointments', route);

  const ctrl = Container.get(config.controllers.appointment.name) as IAppointmentController;

  route.use(isAuth, checkRole(['Doctor']));

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        requestId: Joi.string().required(),
        roomId: Joi.string().required(),
        dateTime: Joi.date().required(),
        status: Joi.string().valid('scheduled', 'completed', 'canceled').required(),
        team: Joi.array().items(Joi.string()).required(),
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
        roomId: Joi.string().optional(),
        dateTime: Joi.date().optional(),
        team: Joi.array().items(Joi.string()).optional(),
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    async (req: any, res: any, next: any) => {
      console.log('Received request to update appointment:', req.params.id);
      console.log('Request body:', req.body);
      try {
        await ctrl.updateAppointment(req, res, next);
        console.log('Appointment updated successfully:', req.params.id);
      } catch (error) {
        console.error('Error updating appointment:', error);
        next(error);
      }
    }
  );

  route.get(
    '/',
    async (req: any, res: any, next: any) => {
      try {
        await ctrl.getAppointments(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );

  route.get(
    '/:id',
    celebrate({
      params: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    async (req: any, res: any, next: any) => {
      try {
        await ctrl.getAppointmentById(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  );
};