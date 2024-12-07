import { Request, Response, NextFunction } from 'express';

export default interface ISpecializationController {
  createSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  deleteSpecialization(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  listSpecializations(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}