import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { IAllergyDTO } from "../dto/IAllergyDTO";
import { AllergyId } from "./allergyId";

interface AllergyProps {
    allergyCode: string;
    allergyName: string;
    allergyDescription: string;
    allergySymptoms: string;
}

export class Allergy extends AggregateRoot<AllergyProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get allergyId(): AllergyId {
        return new AllergyId(this.id.toValue());
    }

    get allergyName(): string {
        return this.props.allergyName;
    }

    get allergyCode(): string {
        return this.props.allergyCode;
    }

    get allergyDescription(): string {
        return this.props.allergyDescription;
    }

    get allergySymptoms(): string {
        return this.props.allergySymptoms;
    }

    set allergyName(value: string) {
        this.props.allergyName = value;
    }

    set allergyCode(value: string) {
        this.props.allergyCode = value;
    }

    set allergyDescription(value: string) {
        this.props.allergyDescription = value;
    }

    set allergySymptoms(value: string) {
        this.props.allergySymptoms = value;
    }

    private constructor(props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(allergyDTO: IAllergyDTO, id?: UniqueEntityID): Result<Allergy> {
        const { allergyCode, allergyName, allergyDescription, allergySymptoms } = allergyDTO;

        const guardedProps = [
            { argument: allergyCode, argumentName: 'allergyCode' },
            { argument: allergyName, argumentName: 'allergyName' },
            { argument: allergyDescription, argumentName: 'allergyDescription' },
            { argument: allergySymptoms, argumentName: 'allergySymptoms' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Allergy>(guardResult.message);
        } else {
            const allergy = new Allergy({ allergyCode, allergyName, allergyDescription, allergySymptoms }, id);
            return Result.ok<Allergy>(allergy);
        }
    }
}