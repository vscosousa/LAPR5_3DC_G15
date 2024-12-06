import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IAllergyController from './IControllers/IAllergyController';
import { Result } from "../core/logic/Result";
import { IAllergyDTO } from '../dto/IAllergyDTO';
import IAllergyService from '../services/IServices/IAllergyService';

@Service()
export default class AllergyController implements IAllergyController {
    constructor(
        @Inject(config.services.allergy.name) private allergyServiceInstance: IAllergyService
    ) { }

    public async createAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

            if (allergyOrError.isFailure) {
                return res.status(400).send(allergyOrError.errorValue());
            }

            const allergyDTO = allergyOrError.getValue();
            return res.status(201).json(allergyDTO);
        } catch (e) {
            return next(e);
        }
    };

    public async updateAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("ID received:", req.params.id); // Log the `id` from the request
            console.log("Body received:", req.body);   // Log the body payload
    
            const { id } = req.params;
            const allergyOrError = await this.allergyServiceInstance.updateAllergy(id, req.body as IAllergyDTO) as Result<IAllergyDTO>;
    
            if (allergyOrError.isFailure) {
                return res.status(400).send(allergyOrError.errorValue());
            }
    
            const allergyDTO = allergyOrError.getValue();
            return res.status(200).json(allergyDTO);
        } catch (e) {
            console.error("Error in updateAllergy:", e);
            return next(e);
        }
    }

    public async deleteAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
    
            const result = await this.allergyServiceInstance.removeAllergy(id);
    
            if (result.isFailure) {
                return res.status(404).send(result.errorValue());
            }
    
            return res.status(200).send({ message: "Allergy successfully deleted." });
        } catch (e) {
            console.error("Error in removeAllergy:", e);
            return next(e);
        }
    }

    public async listAllergys(req: Request, res: Response, next: NextFunction) {
        try {
            const allergys = await this.allergyServiceInstance.listAllergys();
            return res.status(200).json(allergys);
        } catch (e) {
            return next(e);
        }
    }
}