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
            console.log("ID received:", req.params.id); // Log the `id` from the request
            console.log("Body received:", req.body);   // Log the body payload
    
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
     
}