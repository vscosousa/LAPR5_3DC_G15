import { Result } from "../../core/logic/Result";
import { ISpecializationDTO } from "../../dto/ISpecializationDTO";

export default interface ISpecializationService {
  createSpecialization(specializationDTO: ISpecializationDTO): Promise<Result<ISpecializationDTO>>;
  updateSpecialization(id: string, specializationDTO: Partial<ISpecializationDTO>): Promise<Result<ISpecializationDTO>>;
}
