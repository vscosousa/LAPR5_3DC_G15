import { RoomType } from '../domain/roomType';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { Result } from '../core/logic/Result';
import IRoomTypeRepo from '../services/IRepos/IRoomTypeRepo';
import IRoomTypeService from './IServices/IRoomTypeService';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';

@Service()
export default class RoomTypeService implements IRoomTypeService {
  constructor(
    @Inject('logger') private logger: Logger,
    @Inject('RoomTypeRepo') private roomTypeRepo: IRoomTypeRepo
  ) {}

  public async createRoomType(typeName: string): Promise<Result<RoomType>> {
    const roomTypeOrError = RoomType.create({ typeName
        
     });

    if (roomTypeOrError.isFailure) {
      this.logger.error('Failed to add room type:', roomTypeOrError.errorValue());
      return Result.fail<RoomType>(roomTypeOrError.errorValue());
    }

    const roomType = roomTypeOrError.getValue();

    try {
      await this.roomTypeRepo.save(roomType);
      this.logger.info('Room type added:', roomType);
      return Result.ok<RoomType>(roomType);
    } catch (error) {
      this.logger.error('Error saving room type to database:', error);
      return Result.fail<RoomType>('Error saving room type to database');
    }
  }

  public async getRoomTypes(): Promise<Result<RoomType[]>> {
    try {
      const roomTypes = await this.roomTypeRepo.findAll();
      return Result.ok<RoomType[]>(roomTypes);
    } catch (error) {
      this.logger.error('Error fetching room types from database:', error);
      return Result.fail<RoomType[]>('Error fetching room types from database');
    }
  }

  public async updateRoomType(id: string, typeName: string): Promise<Result<RoomType>> {
    try {
      const roomType = await this.roomTypeRepo.findByDomainId(new UniqueEntityID(id));

      if (!roomType) {
        return Result.fail<RoomType>('Room type not found');
      }

      roomType.props.typeName = typeName;

      await this.roomTypeRepo.save(roomType);
      this.logger.info('Room type updated:', roomType);

      return Result.ok<RoomType>(roomType);
    } catch (error) {
      this.logger.error('Error updating room type:', error);
      return Result.fail<RoomType>('Error updating room type');
    }
  }
}