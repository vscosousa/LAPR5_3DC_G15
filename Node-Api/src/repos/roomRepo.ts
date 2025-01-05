import { Service, Inject } from 'typedi';
import { Model, Document } from 'mongoose';
import { Room } from '../domain/room';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { RoomMap } from '../mappers/RoomMap';
import IRoomRepo from '../services/IRepos/IRoomRepo';
import { IRoomPersistence } from '../dataschema/IRoomPersistense';

@Service()
export default class RoomRepo implements IRoomRepo {
    constructor(
        @Inject('roomSchema') private roomSchema: Model<IRoomPersistence & Document>,
        @Inject('logger') private logger
    ) {}
    public async findByDomainId(roomId: UniqueEntityID | string): Promise<Room> {
        const query = { domainId: roomId.toString() };
        const roomDocument = await this.roomSchema.findOne(query);

        if (roomDocument === null) {
            throw new Error('Room not found');
        }

        return RoomMap.toDomain(roomDocument);
    }

    public async exists(room: Room): Promise<boolean> {
        const query = { domainId: room.id.toString() };
        const roomDocument = await this.roomSchema.findOne(query);
        return roomDocument !== null;
    }

    public async findAll(): Promise<Room[]> {
        const roomDocuments = await this.roomSchema.find();
        return roomDocuments.map(doc => RoomMap.toDomain(doc));
    }

    public async save(room: Room): Promise<Room> {
        const query = { domainId: room.id.toString() };
        const roomDocument = await this.roomSchema.findOne(query);
        if (roomDocument === null) {
            const rawRoom = RoomMap.toPersistence(room);
            await this.roomSchema.create(rawRoom);
        } else {
            roomDocument.roomName = room.roomName;
            roomDocument.roomType = room.roomType;
            await roomDocument.save();
        }
        return room;
    }
}