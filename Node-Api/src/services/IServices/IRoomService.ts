import { Result } from "../../core/logic/Result";
import { IRoomDTO } from "../../dto/IRoomDTO";

export default interface IRoomService {

  updateRoom(id: string, roomNumber: string, roomType: string): Promise<Result<IRoomDTO>>;

  createRoom(roomNumber: string, roomType: string): Promise<Result<IRoomDTO>>;

  getRooms(): Promise<Result<IRoomDTO[]>>;

}
