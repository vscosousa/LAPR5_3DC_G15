import { ClientSession } from "mongoose";
import { Repo } from "../../core/infra/Repo";
import { PatientMedicalHistory } from "../../domain/patientMedicalHistory";

export default interface IPatientMedicalHistoryRepo extends Repo<PatientMedicalHistory> {
  save(patientMedicalHistory: PatientMedicalHistory): Promise<PatientMedicalHistory>;
  findByPatientMedicalRecordNumber (patientMedicalRecordNumber: string): Promise<PatientMedicalHistory>;
  startTransaction () : Promise<ClientSession>;
}
