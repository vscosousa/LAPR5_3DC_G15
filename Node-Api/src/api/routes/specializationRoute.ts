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
        (req, res, next) => ctrl.createSpecialization(req, res, next)
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
        (req: any, res: any, next: any) => ctrl.updateSpecialization(req, res, next)
    );

    route.delete(
        '/delete/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required(), 
                
            }),
        }),
        (req, res, next) => ctrl.deleteSpecialization(req, res, next)
    );

    route.get(
        '/',
        (req, res, next) => ctrl.listSpecializations(req, res, next)
    );
};