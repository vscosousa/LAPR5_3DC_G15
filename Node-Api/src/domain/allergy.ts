import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { IAllergyDTO } from "../dto/IAllergyDTO";
import { AllergyId } from "./allergyId";


interface AllergyProps {
  allergyName: string;
}

export class Allergy extends AggregateRoot<AllergyProps>{
    get id(): UniqueEntityID {
        return this._id;
    }

    get allergyId(): AllergyId {
        return new AllergyId(this.id.toValue());
    }

    get allergyName(): string {
        return this.props.allergyName;
    }

    private constructor(props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(allergyDTO: IAllergyDTO, id?: UniqueEntityID): Result<Allergy> {
        const { allergyName } = allergyDTO;

        const guardedProps = [
            { argument: allergyName, argumentName: 'allergyName' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if(!guardResult.succeeded) {
            return Result.fail<Allergy>(guardResult.message);
        } else {
            const allergy = new Allergy({ allergyName }, id);
            return Result.ok<Allergy>(allergy);
        }

    }
}
