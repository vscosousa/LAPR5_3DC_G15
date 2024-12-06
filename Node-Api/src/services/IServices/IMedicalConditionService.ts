import { Result } from "../../core/logic/Result";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";

export default interface IMedicalConditionService {
  createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  updateMedicalCondition(id: string, medicalConditionDTO: Partial<IMedicalConditionDTO>): Promise<Result<IMedicalConditionDTO>>;
  removeMedicalCondition(id: string): Promise<Result<void>>;
  listMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>>;
}