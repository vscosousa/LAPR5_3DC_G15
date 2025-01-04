import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface RoomTypeProps {
    typeName: string;
}

export class RoomType extends AggregateRoot<RoomTypeProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get typeName(): string {
        return this.props.typeName;
    }

    private constructor(props: RoomTypeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoomTypeProps, id?: UniqueEntityID): Result<RoomType> {
        const guardedProps = [
            { argument: props.typeName, argumentName: 'typeName' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<RoomType>(guardResult.message);
        } else {
            const roomType = new RoomType(props, id);
            return Result.ok<RoomType>(roomType);
        }
    }
}