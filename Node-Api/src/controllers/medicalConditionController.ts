import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IMedicalConditionController from './IControllers/IMedicalConditionController';
import { Result } from "../core/logic/Result";
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';


@Service()
export default class MedicalConditionController implements IMedicalConditionController {
    constructor(
        @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance: IMedicalConditionService
    ) { }

    public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
        try {
            const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;

            if (medicalConditionOrError.isFailure) {
                return res.status(400).send(medicalConditionOrError.errorValue());
            }

            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(201).json(medicalConditionDTO);
        } catch (e) {
            return next(e);
        }
    };

    public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("ID received:", req.params.id); // Log the `id` from the request
            console.log("Body received:", req.body);   // Log the body payload
    
            const { id } = req.params;
            const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(id, req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
    
            if (medicalConditionOrError.isFailure) {
                return res.status(400).send(medicalConditionOrError.errorValue());
            }
    
            const medicalConditionDTO = medicalConditionOrError.getValue();
            return res.status(200).json(medicalConditionDTO);
        } catch (e) {
            console.error("Error in updateMedicalCondition:", e);
            return next(e);
        }
    }

    public async deleteMedicalCondition(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
    
            const result = await this.medicalConditionServiceInstance.removeMedicalCondition(id);
    
            if (result.isFailure) {
                return res.status(404).send(result.errorValue());
            }
    
            return res.status(200).send({ message: "MedicalCondition successfully deleted." });
        } catch (e) {
            console.error("Error in removeMedicalCondition:", e);
            return next(e);
        }
    }

    public async listMedicalConditions(req: Request, res: Response, next: NextFunction) {
        try {
            const medicalConditions = await this.medicalConditionServiceInstance.listMedicalConditions();
            return res.status(200).json(medicalConditions);
        } catch (e) {
            return next(e);
        }
    }
}