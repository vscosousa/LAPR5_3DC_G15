import { Mapper } from "../core/infra/Mapper";
import { Room } from "../domain/room";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IRoomDTO } from "../dto/IRoomDTO";
import { IRoomPersistence } from "../dataschema/IRoomPersistense";
import { Document, Model } from "mongoose";

export class RoomMap extends Mapper<Room> {

  public static toDTO(room: any): IRoomDTO {
    return {
      id: room.domainId,
      roomNumber: room.roomNumber,
      roomType: room.roomType
    };
  }

  public static toDomain(room: any | Model<IRoomPersistence & Document>): Room {
    const roomOrError = Room.create(
      {
        roomName: room.roomNumber,
        roomType: room.roomType
      },
      new UniqueEntityID(room.domainId)
    );

    roomOrError.isFailure ? console.log(roomOrError.error) : '';

    return roomOrError.isSuccess ? roomOrError.getValue() : null;
  }

  public static toPersistence(room: Room): any {
    return {
      domainId: room.id.toString(),
      roomNumber: room.roomName,
      roomType: room.roomType
    };
  }
}