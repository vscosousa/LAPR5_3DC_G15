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
            console.log("Body received:", req.body); // Log the body payload

            const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

            if (allergyOrError.isFailure) {
                console.error("Error in createAllergy:", allergyOrError.errorValue()); // Log the error
                return res.status(400).send(allergyOrError.errorValue());
            }

            const allergyDTO = allergyOrError.getValue();
            console.log("Allergy created:", allergyDTO); // Log the created allergy
            return res.status(201).json(allergyDTO);
        } catch (e) {
            console.error("Error in createAllergy:", e); // Log the exception
            return next(e);
        }
    }

    public async updateAllergy(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("ID received:", req.params.id); // Log the `id` from the request
            console.log("Body received:", req.body);   // Log the body payload
    
            const { id } = req.params;
            const allergyOrError = await this.allergyServiceInstance.updateAllergy(id, req.body as IAllergyDTO) as Result<IAllergyDTO>;
    
            if (allergyOrError.isFailure) {
                console.error("Error in updateAllergy:", allergyOrError.errorValue()); // Log the error
                return res.status(400).send(allergyOrError.errorValue());
            }
    
            const allergyDTO = allergyOrError.getValue();
            console.log("Allergy updated:", allergyDTO); // Log the updated allergy
            return res.status(200).json(allergyDTO);
        } catch (e) {
            console.error("Error in updateAllergy:", e); // Log the exception
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
    
            return res.status(204).send();
        } catch (e) {
            console.error("Error in removeAllergy:", e);
            return next(e);
        }
    }
    
    public async listAllergies(req: Request, res: Response, next: NextFunction) {
        try {
            const allergysOrError = await this.allergyServiceInstance.listAllergys();
    
            if (allergysOrError.isFailure) {
                return next(new Error(allergysOrError.errorValue() as unknown as string));
            }
    
            const allergys = allergysOrError.getValue();
            console.log("Allergies listed:", allergys);
            return res.status(200).json(allergys);
        } catch (e) {
            return next(e);
        }
    }
}