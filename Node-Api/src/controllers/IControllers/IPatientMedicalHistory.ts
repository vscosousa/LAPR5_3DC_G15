import { Request, Response, NextFunction } from 'express';

export default interface IPatientMedicalHistoryController {
  createPatientMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updatePatientMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}