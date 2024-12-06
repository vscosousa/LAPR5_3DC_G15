import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import ISpecializationController from './IControllers/ISpecializationController';
import ISpecializationService from '../services/IServices/ISpecializationService';

import { Result } from "../core/logic/Result";
import { ISpecializationDTO } from '../dto/ISpecializationDTO';

@Service()
export default class SpecializationController implements ISpecializationController {
    constructor(
        @Inject(config.services.specialization.name) private specializationServiceInstance: ISpecializationService
    ) { }

    public async createSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const specializationOrError = await this.specializationServiceInstance.createSpecialization(req.body as ISpecializationDTO) as Result<ISpecializationDTO>;

            if (specializationOrError.isFailure) {
                return res.status(400).send(specializationOrError.errorValue());
            }

            const specializationDTO = specializationOrError.getValue();
            return res.status(201).json(specializationDTO);
        } catch (e) {
            return next(e);
        }
    };

    public async updateSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const specializationOrError = await this.specializationServiceInstance.updateSpecialization(id, req.body as ISpecializationDTO) as Result<ISpecializationDTO>;
    
            if (specializationOrError.isFailure) {
                return res.status(400).send(specializationOrError.errorValue());
            }
    
            const specializationDTO = specializationOrError.getValue();
            return res.status(200).json(specializationDTO);
        } catch (e) {
            console.error("Error in updateSpecialization:", e);
            return next(e);
        }
    }

    public async deleteSpecialization(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
    
            const result = await this.specializationServiceInstance.removeSpecialization(id);
    
            if (result.isFailure) {
                return res.status(404).send(result.errorValue());
            }
    
            return res.status(200).send({ message: "Specialization successfully deleted." });
        } catch (e) {
            console.error("Error in removeSpecialization:", e);
            return next(e);
        }
    }

    public async listSpecializations(req: Request, res: Response, next: NextFunction) {
        try {
            const specializations = await this.specializationServiceInstance.listSpecializations();
            return res.status(200).json(specializations);
        } catch (e) {
            return next(e);
        }
    }
}