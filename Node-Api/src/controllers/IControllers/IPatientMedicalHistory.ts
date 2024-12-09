import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';

export default interface IPatientMedicalHistoryController {
  getPatientMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  createPatientMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updatePatientMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}