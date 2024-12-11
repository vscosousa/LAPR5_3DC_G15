import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";
import { MedicalConditionId } from "./medicalConditionId";

interface MedicalConditionProps {
    medicalConditionCode: string;
    medicalConditionName: string;
    medicalConditionDescription: string;
    medicalConditionSymptoms: string;
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get medicalConditionId(): MedicalConditionId {
        return new MedicalConditionId(this.id.toValue());
    }

    get medicalConditionCode(): string {
        return this.props.medicalConditionCode;
    }

    get medicalConditionName(): string {
        return this.props.medicalConditionName;
    }

    get medicalConditionDescription(): string {
        return this.props.medicalConditionDescription;
    }

    get medicalConditionSymptoms(): string {
        return this.props.medicalConditionSymptoms;
    }

    set medicalConditionCode(value: string) {
        this.props.medicalConditionCode = value;
    }

    set medicalConditionName(value: string) {
        this.props.medicalConditionName = value;
    }

    set medicalConditionDescription(value: string) {
        this.props.medicalConditionDescription = value;
    }

    set medicalConditionSymptoms(value: string) {
        this.props.medicalConditionSymptoms = value;
    }

    private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(medicalConditionDTO: IMedicalConditionDTO, id?: UniqueEntityID): Result<MedicalCondition> {
        const { medicalConditionCode, medicalConditionName, medicalConditionDescription, medicalConditionSymptoms } = medicalConditionDTO;

        const guardedProps = [
            { argument: medicalConditionCode, argumentName: 'medicalConditionCode' },
            { argument: medicalConditionName, argumentName: 'medicalConditionName' },
            { argument: medicalConditionDescription, argumentName: 'medicalConditionDescription' },
            { argument: medicalConditionSymptoms, argumentName: 'medicalConditionSymptoms' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<MedicalCondition>(guardResult.message);
        } else {
            const medicalCondition = new MedicalCondition({ medicalConditionCode, medicalConditionName, medicalConditionDescription, medicalConditionSymptoms }, id);
            return Result.ok<MedicalCondition>(medicalCondition);
        }
    }
}