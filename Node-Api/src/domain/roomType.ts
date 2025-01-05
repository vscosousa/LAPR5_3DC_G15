import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";

interface RoomTypeProps {
    typeName: string;
    status: 'suitable' | 'unsuitable';
}

export class RoomType extends AggregateRoot<RoomTypeProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get typeName(): string {
        return this.props.typeName;
    }

    get status(): 'suitable' | 'unsuitable' {
        return this.props.status;
    }

    private constructor(props: RoomTypeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoomTypeProps, id?: UniqueEntityID): Result<RoomType> {
        if (!props.typeName || props.typeName.trim() === '') {
            return Result.fail<RoomType>('typeName is required');
        }

        if (!props.status || (props.status !== 'suitable' && props.status !== 'unsuitable')) {
            return Result.fail<RoomType>('status is required and must be either suitable or unsuitable');
        }

        const roomType = new RoomType(props, id);
        return Result.ok<RoomType>(roomType);
    }
}