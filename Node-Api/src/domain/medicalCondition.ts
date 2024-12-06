import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";
import { MedicalConditionId } from "./medicalConditionId";


interface MedicalConditionProps {
  medicalConditionName: string;
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps>{
    get id(): UniqueEntityID {
        return this._id;
    }

    get medicalConditionId(): MedicalConditionId {
        return new MedicalConditionId(this.id.toValue());
    }

    get medicalConditionName(): string {
        return this.props.medicalConditionName;
    }

    private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(medicalConditionDTO: IMedicalConditionDTO, id?: UniqueEntityID): Result<MedicalCondition> {
        const { medicalConditionName } = medicalConditionDTO;

        const guardedProps = [
            { argument: medicalConditionName, argumentName: 'medicalConditionName' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if(!guardResult.succeeded) {
            return Result.fail<MedicalCondition>(guardResult.message);
        } else {
            const medicalCondition = new MedicalCondition({ medicalConditionName }, id);
            return Result.ok<MedicalCondition>(medicalCondition);
        }

    }
}
