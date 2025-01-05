import { Service, Inject } from 'typedi';
import { Model, Document, FilterQuery } from 'mongoose';
import { RoomType } from '../domain/roomType';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { RoomTypeMap } from '../mappers/RoomTypeMap';
import IRoomTypeRepo from '../services/IRepos/IRoomTypeRepo';
import { IRoomTypePersistence } from '../dataschema/IRoomTypePersistence';

@Service()
export default class RoomTypeRepo implements IRoomTypeRepo {
  constructor(
    @Inject('roomTypeSchema') private roomTypeSchema: Model<IRoomTypePersistence & Document>,
    @Inject('logger') private logger
  ) {}

  public async exists(roomType: RoomType): Promise<boolean> {
    const query = { domainId: roomType.id.toString() };
    const roomTypeDocument = await this.roomTypeSchema.findOne(query);
    return roomTypeDocument !== null;
  }

  public async findAll(): Promise<RoomType[]> {
    const roomTypeDocuments = await this.roomTypeSchema.find();
    return roomTypeDocuments.map(doc => RoomTypeMap.toDomain(doc));
  }

  public async save(roomType: RoomType): Promise<RoomType> {
    try {
      const query = { domainId: roomType.id.toString() };
      const roomTypeDocument = await this.roomTypeSchema.findOne(query);
      if (roomTypeDocument === null) {
        const rawRoomType = RoomTypeMap.toPersistence(roomType);
        await this.roomTypeSchema.create(rawRoomType);
      } else {
        roomTypeDocument.typeName = roomType.props.typeName;
        roomTypeDocument.status = roomType.props.status; // Ensure status is updated
        await roomTypeDocument.save();
      }
      return roomType;
    } catch (e) {
      console.error('Error saving room type:', e);
      throw e;
    }
  }

  public async findByDomainId(roomTypeId: UniqueEntityID | string): Promise<RoomType> {
    const query = { domainId: roomTypeId.toString() };
    const roomTypeDocument = await this.roomTypeSchema.findOne(query as FilterQuery<IRoomTypePersistence & Document>);

    if (roomTypeDocument != null) {
      return RoomTypeMap.toDomain(roomTypeDocument);
    } else {
      return null;
    }
  }
}