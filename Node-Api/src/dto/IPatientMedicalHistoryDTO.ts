export interface IPatientMedicalHistoryDTO {
  id: string;
  patientMedicalRecordNumber: string;
  medicalConditions: string[];
  allergies: string[];
  familyHistory: string[];
  freeText: string;
}