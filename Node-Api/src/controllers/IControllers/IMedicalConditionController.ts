import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController {
  createMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  deleteMedicalCondition(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  listMedicalConditions(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}