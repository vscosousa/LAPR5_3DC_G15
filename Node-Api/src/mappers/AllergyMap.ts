import { Mapper } from "../core/infra/Mapper";
import { Allergy } from "../domain/allergy";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IAllergyDTO } from "../dto/IAllergyDTO";
import { IAllergyPersistence } from "../dataschema/IAllergyPersistence";
import { Document, Model } from "mongoose";


export class AllergyMap extends Mapper<Allergy> {
    public static toDTO(allergy: any): IAllergyDTO{
        return{
            id: allergy.domainId,
            allergyCode: allergy.allergyCode,
            allergyName: allergy.allergyName,
            allergyDescription: allergy.allergyDescription,
            allergySymptoms: allergy.allergySymptoms
        };
    }

    public static toDomain(allergy: any | Model<IAllergyPersistence & Document>): Allergy{
        const roleOrError = Allergy.create(
            allergy,
            new UniqueEntityID(allergy.domainId)
        );

        roleOrError.isFailure ? console.log(roleOrError.error) : '';
        return roleOrError.isSuccess ? roleOrError.getValue() : null;
    }

    public static toPersistence(allergy: Allergy): any{
        return{
            domainId: allergy.id.toString(),
            allergyCode: allergy.allergyCode,
            allergyName: allergy.allergyName,
            allergyDescription: allergy.allergyDescription,
            allergySymptoms: allergy.allergySymptoms
        };
    }
}