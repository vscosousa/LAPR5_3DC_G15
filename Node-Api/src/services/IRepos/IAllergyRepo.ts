import { Repo } from "../../core/infra/Repo";
import { Allergy } from "../../domain/allergy";
import { AllergyId } from "../../domain/allergyId";

export default interface IAllergyRepo extends Repo<Allergy>{
    save(allergy: Allergy): Promise<Allergy>;
    findbydomainid(allergyId: AllergyId | string): Promise<Allergy>;
    delete(allergy:Allergy): Promise<void>;
    findall(): Promise<Allergy[]>;
}