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
        (req, res, next) => ctrl.createMedicalCondition(req, res, next)
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
        (req: any, res: any, next: any) => ctrl.updateMedicalCondition(req, res, next)
    );

    route.delete(
        '/delete/:id',
        celebrate({
            params: Joi.object({
                id: Joi.string().required(), // Validate the medicalCondition ID
            }),
        }),
        (req, res, next) => ctrl.deleteMedicalCondition(req, res, next)
    );

    route.get(
        '/',
        (req, res, next) => ctrl.listMedicalConditions(req, res, next)
    );
};