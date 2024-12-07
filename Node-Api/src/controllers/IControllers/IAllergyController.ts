import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController {
  createAllergy(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateAllergy(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  deleteAllergy(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  listAllergies(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}