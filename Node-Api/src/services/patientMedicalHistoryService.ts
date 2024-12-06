import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import IPatientMedicalHistoryService from './IServices/IPatientMedicalHistoryService';
import IPatientMedicalHistoryRepo from './IRepos/IPatientMedicalHistoryRepo';
import { PatientMedicalHistory } from '../domain/patientMedicalHistory';
import { PatientMedicalHistoryMap } from '../mappers/PatientMedicalHistoryMap';
import config from '../../config';
import { IPatientMedicalHistoryDTO } from '../dto/IPatientMedicalHistoryDTO';

@Service()
export default class PatientMedicalHistoryService implements IPatientMedicalHistoryService {
  constructor(
    @Inject(config.repos.patientMedicalHistory.name) private patientMedicalHistoryRepo: IPatientMedicalHistoryRepo,
    @Inject('logger') private logger,
  ) {}

  public async createPatientMedicalHistory(patientMedicalHistoryDTO: IPatientMedicalHistoryDTO): Promise<Result<IPatientMedicalHistoryDTO>> {
    try {
      this.logger.info('Creating patientMedicalHistory with DTO:', patientMedicalHistoryDTO);

      const patientMedicalHistoryOrError = PatientMedicalHistory.create({
        id: patientMedicalHistoryDTO.id,
        patientMedicalRecordNumber: patientMedicalHistoryDTO.patientMedicalRecordNumber,
        medicalConditions: patientMedicalHistoryDTO.medicalConditions,
        allergies: patientMedicalHistoryDTO.allergies,
      });

      if (patientMedicalHistoryOrError.isFailure) {
        this.logger.error('Error creating PatientMedicalHistory:', patientMedicalHistoryOrError.errorValue());
        return Result.fail<IPatientMedicalHistoryDTO>(patientMedicalHistoryOrError.errorValue());
      }

      const patientMedicalHistory = patientMedicalHistoryOrError.getValue();
      this.logger.info('Saving patientMedicalHistory:', patientMedicalHistory);
      await this.patientMedicalHistoryRepo.save(patientMedicalHistory);

      const patientMedicalHistoryDTOResult = PatientMedicalHistoryMap.toDTO(patientMedicalHistory);
      return Result.ok<IPatientMedicalHistoryDTO>(patientMedicalHistoryDTOResult);
    } catch (e) {
      this.logger.error('Error in createPatientMedicalHistory:', e);
      throw e;
    }
  }

  public async updatePatientMedicalHistory(patientMedicalRecordNumber: string, patientMedicalHistoryDTO: Partial<IPatientMedicalHistoryDTO>): Promise<Result<IPatientMedicalHistoryDTO>> {
    try {
      const patientMedicalHistory = await this.patientMedicalHistoryRepo.findByPatientMedicalRecordNumber(patientMedicalRecordNumber);

      if (!patientMedicalHistory) {
        return Result.fail<IPatientMedicalHistoryDTO>("PatientMedicalHistory not found");
      }

      if (patientMedicalHistoryDTO.patientMedicalRecordNumber) patientMedicalHistory.props.patientMedicalRecordNumber = patientMedicalHistoryDTO.patientMedicalRecordNumber;
      if (patientMedicalHistoryDTO.medicalConditions) patientMedicalHistory.props.medicalConditions = patientMedicalHistoryDTO.medicalConditions;
      if (patientMedicalHistoryDTO.allergies) patientMedicalHistory.props.allergies = patientMedicalHistoryDTO.allergies;

      await this.patientMedicalHistoryRepo.save(patientMedicalHistory);

      const patientMedicalHistoryDTOResult = PatientMedicalHistoryMap.toDTO(patientMedicalHistory);
      return Result.ok<IPatientMedicalHistoryDTO>(patientMedicalHistoryDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
