import { Mapper } from "../core/infra/Mapper";
import { PatientMedicalHistory } from "../domain/patientMedicalHistory";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Document, Model } from "mongoose";
import { IPatientMedicalHistoryDTO } from "../dto/IPatientMedicalHistoryDTO";
import { IPatientMedicalHistoryPersistence } from "../dataschema/IPatientMedicalHistoryPersistence";

export class PatientMedicalHistoryMap extends Mapper<PatientMedicalHistory> {

  public static toDTO(patientMedicalHistory: any): IPatientMedicalHistoryDTO {
    return {
      id: patientMedicalHistory.id.toString(),
      patientMedicalRecordNumber: patientMedicalHistory.patientMedicalRecordNumber,
      medicalConditions: patientMedicalHistory.medicalConditions.toString(),
      allergies: patientMedicalHistory.allergies.toString()
    };
  }

  public static toDomain (patientMedicalHistory: any | Model<IPatientMedicalHistoryPersistence & Document> ): PatientMedicalHistory {
    const roleOrError = PatientMedicalHistory.create(
      patientMedicalHistory,
      new UniqueEntityID(patientMedicalHistory.domainId)
    );

    roleOrError.isFailure ? console.log(roleOrError.error) : '';

    return roleOrError.isSuccess ? roleOrError.getValue() : null;
  }

  public static toPersistence(patientMedicalHistory: PatientMedicalHistory): any {
    return {
      domainId: patientMedicalHistory.id.toString(),
      patientMedicalRecordNumber: patientMedicalHistory.patientMedicalRecordNumber,
      medicalConditions: patientMedicalHistory.medicalConditions.toString(),
      allergies: patientMedicalHistory.allergies.toString()
    };
  }
}
