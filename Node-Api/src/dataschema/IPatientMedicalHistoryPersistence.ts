export interface IPatientMedicalHistoryPersistence {
  domainId: string;
  patientMedicalRecordNumber: string;
  medicalConditions: string[];
  allergies: string[];
  familyHistory: string[];
  freeText: string;
}
