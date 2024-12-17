import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { SpecializationId } from './specializationId';
import { ISpecializationDTO } from '../dto/ISpecializationDTO';

interface SpecializationProps {
  specializationType: string;
}

export class Specialization extends AggregateRoot<SpecializationProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get specializationId(): SpecializationId {
        return new SpecializationId(this.id.toValue());
    }

    get specializationType(): string {
        return this.props.specializationType;
    }

    private constructor(props: SpecializationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(specializationDTO: ISpecializationDTO, id?: UniqueEntityID): Result<Specialization> {
        const { specializationType } = specializationDTO;

        const guardedProps = [
            { argument: specializationType, argumentName: 'specializationType' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Specialization>(guardResult.message);
        }

        if (specializationType.trim() === '') {
            return Result.fail<Specialization>('specializationType cannot be an empty string');
        }

        const specialization = new Specialization({ specializationType }, id);
        return Result.ok<Specialization>(specialization);
    }
}