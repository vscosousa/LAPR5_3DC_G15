import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { Result } from '../core/logic/Result';
import IRoomTypeRepo from '../services/IRepos/IRoomTypeRepo';
import IRoomTypeService from './IServices/IRoomTypeService';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { RoomType } from '../domain/roomType';
import { IRoomTypeDTO } from '../dto/IRoomTypeDTO';
import { RoomTypeMap } from '../mappers/RoomTypeMap';
import config from '../../config';

@Service()
export default class RoomTypeService implements IRoomTypeService {
    constructor(
        @Inject('logger') private logger: Logger,
        @Inject(config.repos.roomType.name) private roomTypeRepo: IRoomTypeRepo
    ) {}

    public async createRoomType(typeName: string, status: 'suitable' | 'unsuitable'): Promise<Result<IRoomTypeDTO>> {
        try {
            const roomTypeOrError = RoomType.create({ typeName, status });
            if (roomTypeOrError.isFailure) {
                this.logger.error('Failed to add room type:', roomTypeOrError.errorValue());
                return Result.fail<IRoomTypeDTO>(roomTypeOrError.errorValue());
            }
            const roomType = roomTypeOrError.getValue();
            await this.roomTypeRepo.save(roomType);
            this.logger.info('Room type added:', roomType);
            const roomTypeDTO = RoomTypeMap.toDTO(roomType);
            return Result.ok<IRoomTypeDTO>(roomTypeDTO);
        } catch (e) {
            this.logger.error('Failed to add room type:', e.toString());
            return Result.fail<IRoomTypeDTO>(e.toString());
        }
    }

    public async getRoomTypes(): Promise<Result<IRoomTypeDTO[]>> {
        try {
            const roomTypes = await this.roomTypeRepo.findAll();
            const roomTypeDTOs: IRoomTypeDTO[] = roomTypes.map(roomType => RoomTypeMap.toDTO(roomType));
            return Result.ok<IRoomTypeDTO[]>(roomTypeDTOs);
        } catch (e) {
            this.logger.error('Failed to get room types:', e);
            return Result.fail<IRoomTypeDTO[]>(e.toString());
        }
    }

    public async updateRoomType(id: string, typeName: string, status: 'suitable' | 'unsuitable'): Promise<Result<IRoomTypeDTO>> {
        try {
            const roomType = await this.roomTypeRepo.findByDomainId(new UniqueEntityID(id));

            if (!roomType) {
                this.logger.error('Room type not found');
                return Result.fail<IRoomTypeDTO>('Room type not found');
            }

            roomType.props.typeName = typeName;
            roomType.props.status = status;

            await this.roomTypeRepo.save(roomType);
            this.logger.info('Room type updated:', roomType);

            const roomTypeDTO: IRoomTypeDTO = RoomTypeMap.toDTO(roomType);

            return Result.ok<IRoomTypeDTO>(roomTypeDTO);
        } catch (error) {
            this.logger.error('Error updating room type:', error);
            return Result.fail<IRoomTypeDTO>('Error updating room type');
        }
    }
}