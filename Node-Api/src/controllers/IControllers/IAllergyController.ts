import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController {
  createAllergy(req: Request, res: Response, next: NextFunction);
  updateAllergy(req: Request, res: Response, next: NextFunction);
  deleteAllergy(req: Request, res: Response, next: NextFunction);
  listAllergys(req: Request, res: Response, next: NextFunction);
}