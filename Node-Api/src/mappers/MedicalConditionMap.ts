import { Mapper } from "../core/infra/Mapper";
import { MedicalCondition } from "../domain/medicalCondition";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";
import { Document, Model } from "mongoose";


export class MedicalConditionMap extends Mapper<MedicalCondition> {
    public static toDTO(medicalCondition: any): IMedicalConditionDTO{
        return{
            id: medicalCondition.domainId,
            medicalConditionCode: medicalCondition.medicalConditionCode,
            medicalConditionName: medicalCondition.medicalConditionName,
            medicalConditionDescription: medicalCondition.medicalConditionDescription,
            medicalConditionSymptoms: medicalCondition.medicalConditionSymptoms
        };
    }

    public static toDomain(medicalCondition: any | Model<IMedicalConditionPersistence & Document>): MedicalCondition{
        const roleOrError = MedicalCondition.create(
            medicalCondition,
            new UniqueEntityID(medicalCondition.domainId)
        );

        roleOrError.isFailure ? console.log(roleOrError.error) : '';
        return roleOrError.isSuccess ? roleOrError.getValue() : null;
    }

    public static toPersistence(medicalCondition: MedicalCondition): any{
        return{
            domainId: medicalCondition.id.toString(),
            medicalConditionCode: medicalCondition.medicalConditionCode,
            medicalConditionName: medicalCondition.medicalConditionName,
            medicalConditionDescription: medicalCondition.medicalConditionDescription,
            medicalConditionSymptoms: medicalCondition.medicalConditionSymptoms
        };
    }
}