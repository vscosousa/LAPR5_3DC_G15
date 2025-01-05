import { Repo } from "../../core/infra/Repo";
import { Room } from "../../domain/room";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export default interface IRoomRepo extends Repo<Room> {
  findAll(): Promise<Room[]>;
  save(room: Room): Promise<Room>;
  findByDomainId(roomId: UniqueEntityID | string): Promise<Room>;
}