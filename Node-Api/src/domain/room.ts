import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";

interface RoomProps {
    roomName: string;
    roomType: string;
}

export class Room extends AggregateRoot<RoomProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get roomName(): string {
        return this.props.roomName;
    }

    get roomType(): string {
        return this.props.roomType;
    }

    private constructor(props: RoomProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoomProps, id?: UniqueEntityID): Result<Room> {
        if (!props.roomName || props.roomName.trim() === '') {
            return Result.fail<Room>('roomNumber is required');
        }
        if (!props.roomType || props.roomType.trim() === '') {
            return Result.fail<Room>('roomType is required');
        }

        const room = new Room(props, id);
        return Result.ok<Room>(room);
    }
}