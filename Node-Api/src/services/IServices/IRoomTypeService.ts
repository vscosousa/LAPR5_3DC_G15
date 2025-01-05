import { Result } from "../../core/logic/Result";
import { IRoomTypeDTO } from "../../dto/IRoomTypeDTO";

export default interface IRoomTypeService {

  createRoomType(typeName: string, status: 'suitable' | 'unsuitable'): Promise<Result<IRoomTypeDTO>>;

  getRoomTypes(): Promise<Result<IRoomTypeDTO[]>>;

  updateRoomType(id: string, typeName: string, status: string): Promise<Result<IRoomTypeDTO>>;

}