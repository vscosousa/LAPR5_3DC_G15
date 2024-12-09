import { Service, Inject } from 'typedi';
import { ClientSession, Document, FilterQuery, Model } from 'mongoose';

import { PatientMedicalHistory } from "../domain/patientMedicalHistory";
import { PatientMedicalHistoryId } from "../domain/patientMedicalHistoryId";
import { PatientMedicalHistoryMap } from "../mappers/PatientMedicalHistoryMap";
import IPatientMedicalHistoryRepo from '../services/IRepos/IPatientMedicalHistoryRepo';
import { IPatientMedicalHistoryPersistence } from '../dataschema/IPatientMedicalHistoryPersistence';

@Service()
export default class PatientMedicalHistoryRepo implements IPatientMedicalHistoryRepo {
  private models: any;

  constructor(
    @Inject('patientMedicalHistorySchema') private patientMedicalHistorySchema: Model<IPatientMedicalHistoryPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(patientMedicalHistory: PatientMedicalHistory): Promise<boolean> {
    const idX = patientMedicalHistory.id instanceof PatientMedicalHistoryId ? (<PatientMedicalHistoryId>patientMedicalHistory.id).toValue() : patientMedicalHistory.id;

    const query = { domainId: idX };
    const patientMedicalHistoryDocument = await this.patientMedicalHistorySchema.findOne(query as FilterQuery<IPatientMedicalHistoryPersistence & Document>);

    return !!patientMedicalHistoryDocument === true;
  }

  public async save(patientMedicalHistory: PatientMedicalHistory): Promise<PatientMedicalHistory> {
    const query = { domainId: patientMedicalHistory.id.toString() };

    const patientMedicalHistoryDocument = await this.patientMedicalHistorySchema.findOne(query);

    try {
      if (patientMedicalHistoryDocument === null) {
        const rawPatientMedicalHistory: any = PatientMedicalHistoryMap.toPersistence(patientMedicalHistory);
        this.logger.info('Creating new patientMedicalHistory:', rawPatientMedicalHistory);

        const patientMedicalHistoryCreated = await this.patientMedicalHistorySchema.create(rawPatientMedicalHistory);

        return PatientMedicalHistoryMap.toDomain(patientMedicalHistoryCreated);
      } else {
        patientMedicalHistoryDocument.patientMedicalRecordNumber = patientMedicalHistory.patientMedicalRecordNumber;
        patientMedicalHistoryDocument.medicalConditions = patientMedicalHistory.medicalConditions;
        patientMedicalHistoryDocument.allergies = patientMedicalHistory.allergies;
        this.logger.info('Updating existing patientMedicalHistory:', patientMedicalHistoryDocument);

        await patientMedicalHistoryDocument.save();

        return patientMedicalHistory;
      }
    } catch (err) {
      this.logger.error('Error saving patientMedicalHistory:', err);
      throw err;
    }
  }

  public async findByPatientMedicalRecordNumber(patientMedicalRecordNumber: string): Promise<PatientMedicalHistory | null> {
    this.logger.info(`Finding patientMedicalHistory with record number: ${patientMedicalRecordNumber}`);
    const query = { patientMedicalRecordNumber: patientMedicalRecordNumber };
    const patientMedicalHistoryDocument = await this.patientMedicalHistorySchema.findOne(query as FilterQuery<IPatientMedicalHistoryPersistence & Document>);
  
    if (patientMedicalHistoryDocument) {
      this.logger.info(`Found patientMedicalHistory: ${patientMedicalHistoryDocument}`);
      return PatientMedicalHistoryMap.toDomain(patientMedicalHistoryDocument);
    }
  
    this.logger.info(`No patientMedicalHistory found with record number: ${patientMedicalRecordNumber}`);
    return null;
  }

  public async startTransaction(): Promise<ClientSession> {
    const session = await this.patientMedicalHistorySchema.startSession();
    session.startTransaction();
    return session;
  }
}
