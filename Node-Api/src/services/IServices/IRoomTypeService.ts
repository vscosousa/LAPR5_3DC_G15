import { Result } from "../../core/logic/Result";
import { IRoomTypeDTO } from "../../dto/IRoomTypeDTO";

export default interface IRoomTypeService {

  createRoomType(typeName: string): Promise<Result<IRoomTypeDTO>>;

  getRoomTypes(): Promise<Result<IRoomTypeDTO[]>>;

  updateRoomType(id: string, typeName: string): Promise<Result<IRoomTypeDTO>>;

}