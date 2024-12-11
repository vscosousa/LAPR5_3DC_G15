import { IPatientMedicalHistoryPersistence } from '../../dataschema/IPatientMedicalHistoryPersistence';
import mongoose from 'mongoose';

const PatientMedicalHistory = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true
    },

    patientMedicalRecordNumber: {
      type: String,
      unique: true,
      index: true
    },

    medicalConditions: {
      type: [String],
      index: true
    },

    allergies: {
      type: [String],
      index: true
    },

    familyHistory: {
      type: [String],
      index: true
    },

    freeText: {
      type: String,
      index: true
    },
  },
  { timestamps: true },
);

export default mongoose.model<IPatientMedicalHistoryPersistence & mongoose.Document>('PatientMedicalHistory', PatientMedicalHistory);
