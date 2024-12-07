import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import ISpecializationController from '../../controllers/IControllers/ISpecializationController';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use('/specializations', route);

    const ctrl = Container.get(config.controllers.specialization.name) as ISpecializationController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                specializationType: Joi.string().required()
            }),
        }),
        async (req, res, next) => {
            try {
                await ctrl.createSpecialization(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        celebrate({
            body: Joi.object({
                specializationType: Joi.string().required()
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req, res, next) => {
            try {
                await ctrl.updateSpecialization(req, res, next);
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
                await ctrl.deleteSpecialization(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/',
        async (req, res, next) => {
            try {
                await ctrl.listSpecializations(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};