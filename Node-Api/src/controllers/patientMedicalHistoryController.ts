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
    @Inject(config.services.patientMedicalHistory.name) private patientMedicalHistoryServiceInstance: IPatientMedicalHistoryService
  ) { }

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
      const { patientMedicalRecordNumber } = req.params;
      console.log(`Updating medical history for patient with record number: ${patientMedicalRecordNumber}`);
      const patientMedicalHistoryOrError = await this.patientMedicalHistoryServiceInstance.updatePatientMedicalHistory(patientMedicalRecordNumber, req.body as Partial<IPatientMedicalHistoryDTO>) as Result<IPatientMedicalHistoryDTO>;

      if (patientMedicalHistoryOrError.isFailure) {
        console.error(`Failed to update medical history: ${patientMedicalHistoryOrError.errorValue()}`);
        return res.status(400).send(patientMedicalHistoryOrError.errorValue());
      }

      const patientMedicalHistoryDTO = patientMedicalHistoryOrError.getValue();
      console.log(`Successfully updated medical history for patient with record number: ${patientMedicalRecordNumber}`);
      return res.status(200).json(patientMedicalHistoryDTO);
    }
    catch (e) {
      console.error(`Error updating medical history: ${e.message}`);
      return next(e);
    }
  };

  public async getPatientMedicalHistory(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(`Fetching medical history for patient with record number: ${req.params.patientMedicalRecordNumber}`);
      const patientMedicalHistory = await this.patientMedicalHistoryServiceInstance.getPatientMedicalHistory(req.params.patientMedicalRecordNumber);
      if (patientMedicalHistory.isFailure) {
        console.error(`Failed to fetch medical history: ${patientMedicalHistory.errorValue()}`);
        return res.status(404).json({ message: patientMedicalHistory.errorValue() });
      }
      console.log(`Successfully fetched medical history for patient with record number: ${req.params.patientMedicalRecordNumber}`);
      return res.status(200).json(patientMedicalHistory.getValue());
    } catch (e) {
      console.error(`Error fetching medical history: ${e.message}`);
      return next(e);
    }
  }
}
