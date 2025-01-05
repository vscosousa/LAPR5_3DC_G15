import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";

interface RoomTypeProps {
    typeName: string;
}

export class RoomType extends AggregateRoot<RoomTypeProps> {
    props: RoomTypeProps;

    get id(): UniqueEntityID {
        return this._id;
    }

    get typeName(): string {
        return this.props.typeName;
    }

    private constructor(props: RoomTypeProps, id?: UniqueEntityID) {
        super(props, id);
        this.props = props;
    }

    public static create(props: RoomTypeProps, id?: UniqueEntityID): Result<RoomType> {

      if (!props.typeName || props.typeName.trim() === '') {
  
          return Result.fail<RoomType>('typeName is required');
  
      }
  
      const roomType = new RoomType(props, id);
  
      return Result.ok<RoomType>(roomType);
  
  }
}