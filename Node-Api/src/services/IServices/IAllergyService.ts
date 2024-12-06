import { Result } from "../../core/logic/Result";
import { IAllergyDTO } from "../../dto/IAllergyDTO";

export default interface IAllergyService {
  createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  updateAllergy(id: string, allergyDTO: Partial<IAllergyDTO>): Promise<Result<IAllergyDTO>>;
  removeAllergy(id: string): Promise<Result<void>>;
  listAllergys(): Promise<Result<IAllergyDTO[]>>;
}