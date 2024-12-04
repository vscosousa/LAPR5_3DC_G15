import { Repo } from "../../core/infra/Repo";
import { Specialization } from "../../domain/specialization";
import { SpecializationId } from "../../domain/specializationId";

export default interface ISpecializationRepo extends Repo<Specialization>{
    save(specialization: Specialization): Promise<Specialization>;
}