import { Mapper } from "../core/infra/Mapper";
import { Specialization } from "../domain/specialization";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ISpecializationDTO } from "../dto/ISpecializationDTO";
import { ISpecializationPersistence } from "../dataschema/ISpecializationPersistence";
import { Document, Model } from "mongoose";


export class SpecializationMap extends Mapper<Specialization> {
    public static toDTO(specialization: any): ISpecializationDTO{
        return{
            id: specialization.id.toString(),
            specializationType: specialization.specializationType
        };
    }

    public static toDomain(specialization: any | Model<ISpecializationPersistence & Document>): Specialization{
        const roleOrError = Specialization.create(
            specialization,
            new UniqueEntityID(specialization.domainId)
        );

        roleOrError.isFailure ? console.log(roleOrError.error) : '';
        return roleOrError.isSuccess ? roleOrError.getValue() : null;
    }

    public static toPersistence(specialization: Specialization): any{
        return{
            domainId: specialization.id.toString(),
            specializationType: specialization.specializationType
        };
    }
}