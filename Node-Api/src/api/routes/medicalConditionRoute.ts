import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from '../../../config';
import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';

const route = Router();

export default (app: Router) => {
    app.use('/medicalConditions', route);

    const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;

    route.post(
        '/create',
        celebrate({
            body: Joi.object({
                medicalConditionName: Joi.string().required()
            }),
        }),
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.createMedicalCondition(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.put(
        '/update/:id',
        celebrate({
            body: Joi.object({
                medicalConditionName: Joi.string().required()
            }),
            params: Joi.object({
                id: Joi.string().required(),
            }),
        }),
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.updateMedicalCondition(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.delete(
        '/delete/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required(), // Validate the medicalCondition ID
            }),
        }),
        async (req, res, next) => {
            try {
                await ctrl.deleteMedicalCondition(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );

    route.get(
        '/',
        async (req: any, res: any, next: any) => {
            try {
                await ctrl.listMedicalConditions(req, res, next);
            } catch (error) {
                next(error);
            }
        }
    );
};