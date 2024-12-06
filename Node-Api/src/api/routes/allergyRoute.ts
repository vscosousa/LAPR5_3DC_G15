import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IAllergyController from '../../controllers/IControllers/IAllergyController';

const route = Router();

export default (app: Router) => {
    app.use('/allergies', route);

    const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                allergyName: Joi.string().required()
            }),
        }),
        (req, res, next) => ctrl.createAllergy(req, res, next)
    );

    route.put(
        '/update/:id',
        celebrate({
            body: Joi.object({
                allergyName: Joi.string().required()
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        (req: any, res: any, next: any) => ctrl.updateAllergy(req, res, next)
    );

    route.delete(
        '/delete/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required(), // Validate the allergy ID
            }),
        }),
        (req, res, next) => ctrl.deleteAllergy(req, res, next)
    );

    route.get(
        '/',
        (req, res, next) => ctrl.listAllergys(req, res, next)
    );
};