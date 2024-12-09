import { Result } from "../../core/logic/Result";
import { IPatientMedicalHistoryDTO } from "../../dto/IPatientMedicalHistoryDTO";

export default interface IPatientMedicalHistoryService {
  getPatientMedicalHistory(id: string): Promise<Result<IPatientMedicalHistoryDTO>>;
  createPatientMedicalHistory(patientMedicalHistoryDTO: IPatientMedicalHistoryDTO): Promise<Result<IPatientMedicalHistoryDTO>>;
  updatePatientMedicalHistory(id: string, patientMedicalHistoryDTO: Partial<IPatientMedicalHistoryDTO>): Promise<Result<IPatientMedicalHistoryDTO>>;
}
