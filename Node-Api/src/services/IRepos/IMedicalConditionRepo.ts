import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/medicalCondition";
import { MedicalConditionId } from "../../domain/medicalConditionId";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition>{
    save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;
    findbydomainid(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition>;
    delete(medicalCondition:MedicalCondition): Promise<void>;
    findall(): Promise<MedicalCondition[]>;
}