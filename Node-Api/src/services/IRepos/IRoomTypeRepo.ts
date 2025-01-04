import { Repo } from "../../core/infra/Repo";
import { RoomType } from "../../domain/roomType";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export default interface IRoomTypeRepo extends Repo<RoomType> {
  findAll(): Promise<RoomType[]>;
  save(roomType: RoomType): Promise<RoomType>;
  findByDomainId(roomTypeId: UniqueEntityID | string): Promise<RoomType>;
}