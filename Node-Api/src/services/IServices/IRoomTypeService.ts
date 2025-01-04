import { Result } from "../../core/logic/Result";
import { RoomType } from "../../domain/roomType";

export default interface IRoomTypeService {

  createRoomType(typeName: string): Promise<Result<RoomType>>;

  getRoomTypes(): Promise<Result<RoomType[]>>;

  updateRoomType(id: string, typeName: string): Promise<Result<RoomType>>;

}