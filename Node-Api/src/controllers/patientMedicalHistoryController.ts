import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IPatientMedicalHistoryController from './IControllers/IPatientMedicalHistory';
import { IPatientMedicalHistoryDTO } from '../dto/IPatientMedicalHistoryDTO';
import IPatientMedicalHistoryService from '../services/IServices/IPatientMedicalHistoryService';

@Service()
export default class PatientMedicalHistoryController implements IPatientMedicalHistoryController {
  constructor(
      @Inject(config.services.patientMedicalHistory.name) private patientMedicalHistoryServiceInstance : IPatientMedicalHistoryService
  ) {}

  public async createPatientMedicalHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const patientMedicalHistoryOrError = await this.patientMedicalHistoryServiceInstance.createPatientMedicalHistory(req.body as IPatientMedicalHistoryDTO) as Result<IPatientMedicalHistoryDTO>;

      if (patientMedicalHistoryOrError.isFailure) {
        return res.status(400).send(patientMedicalHistoryOrError.errorValue());
      }

      const patientMedicalHistoryDTO = patientMedicalHistoryOrError.getValue();
      return res.status(201).json(patientMedicalHistoryDTO);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updatePatientMedicalHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patientMedicalHistoryOrError = await this.patientMedicalHistoryServiceInstance.updatePatientMedicalHistory(id, req.body as Partial<IPatientMedicalHistoryDTO>) as Result<IPatientMedicalHistoryDTO>;

      if (patientMedicalHistoryOrError.isFailure) {
        return res.status(400).send(patientMedicalHistoryOrError.errorValue());
      }

      const patientMedicalHistoryDTO = patientMedicalHistoryOrError.getValue();
      return res.status(200).json(patientMedicalHistoryDTO);
    }
    catch (e) {
      return next(e);
    }
  };
}
