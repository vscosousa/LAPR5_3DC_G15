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
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.createAllergy(req, res, next);
            } catch (error) {
                next(error);
            }
        }
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
        async (req: any, res: any, next: any) => {
            try {
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
                id: Joi.string().required(), // Validate the allergy ID
            }),
        }),
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.deleteAllergy(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/',
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.listAllergies(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};