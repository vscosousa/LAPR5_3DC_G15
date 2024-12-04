import { Request, Response, NextFunction } from 'express';

export default interface ISpecializationController {
  createSpecialization(req: Request, res: Response, next: NextFunction);
  updateSpecialization(req: Request, res: Response, next: NextFunction);
}