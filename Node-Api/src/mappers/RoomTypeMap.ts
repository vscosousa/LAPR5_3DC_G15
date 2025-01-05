import { Mapper } from "../core/infra/Mapper";
import { RoomType } from "../domain/roomType";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IRoomTypePersistence } from "../dataschema/IRoomTypePersistence";
import { IRoomTypeDTO } from "../dto/IRoomTypeDTO";

export class RoomTypeMap extends Mapper<RoomType> {
  public static toDomain(raw: any): RoomType {
    const roomTypeOrError = RoomType.create(
      {
        typeName: raw.typeName,
      },
      new UniqueEntityID(raw.domainId)
    );

    roomTypeOrError.isFailure ? console.log(roomTypeOrError.error) : '';

    return roomTypeOrError.isSuccess ? roomTypeOrError.getValue() : null;
  }

  public static toPersistence(roomType: RoomType): IRoomTypePersistence {
    return {
      domainId: roomType.id.toString(),
      typeName: roomType.typeName,
    };
  }

  public static toDTO(roomType: RoomType): IRoomTypeDTO {
    return {
      id: roomType.id.toString(),
      typeName: roomType.typeName
    };
  }
}