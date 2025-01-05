import { Mapper } from "../core/infra/Mapper";
import { RoomType } from "../domain/roomType";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IRoomTypeDTO } from "../dto/IRoomTypeDTO";
import { IRoomTypePersistence } from "../dataschema/IRoomTypePersistence";
import { Document, Model } from "mongoose";

export class RoomTypeMap extends Mapper<RoomType> {

  public static toDTO(roomType: RoomType): IRoomTypeDTO {
    return {
      domainId: roomType.id.toString(),
      typeName: roomType.typeName,
      status: roomType.status
    };
  }

  public static toDomain(roomType: any | Model<IRoomTypePersistence & Document>): RoomType {
    const roomTypeOrError = RoomType.create(
      {
        typeName: roomType.typeName,
        status: roomType.status
      },
      new UniqueEntityID(roomType.domainId)
    );

    roomTypeOrError.isFailure ? console.log(roomTypeOrError.error) : '';

    return roomTypeOrError.isSuccess ? roomTypeOrError.getValue() : null;
  }

  public static toPersistence(roomType: RoomType): any {
    return {
      domainId: roomType.id.toString(),
      typeName: roomType.typeName,
      status: roomType.status
    };
  }
}