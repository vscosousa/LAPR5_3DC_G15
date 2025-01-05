import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { Result } from '../core/logic/Result';
import IRoomRepo from '../services/IRepos/IRoomRepo';
import IRoomService from './IServices/IRoomService';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { Room } from '../domain/room';
import { IRoomDTO } from '../dto/IRoomDTO';
import { RoomMap } from '../mappers/RoomMap';

@Service()
export default class RoomService implements IRoomService {
    constructor(
        @Inject('logger') private logger: Logger,
        @Inject('roomRepo') private roomRepo: IRoomRepo
    ) {}

    public async createRoom(roomName: string, roomType: string): Promise<Result<IRoomDTO>> {
        try {
            const roomOrError = Room.create({ roomName, roomType });
            if (roomOrError.isFailure) {
                this.logger.error('Failed to add room:', roomOrError.errorValue());
                return Result.fail<IRoomDTO>(roomOrError.errorValue());
            }
            const room = roomOrError.getValue();
            await this.roomRepo.save(room);
            this.logger.info('Room added:', room);
            const roomDTO = RoomMap.toDTO(room);
            return Result.ok<IRoomDTO>(roomDTO);
        } catch (e) {
            this.logger.error('Failed to add room:', e.toString());
            return Result.fail<IRoomDTO>(e.toString());
        }
    }

    public async getRooms(): Promise<Result<IRoomDTO[]>> {
        try {
            const rooms = await this.roomRepo.findAll();
            const roomDTOs: IRoomDTO[] = rooms.map(room => RoomMap.toDTO(room));
            return Result.ok<IRoomDTO[]>(roomDTOs);
        } catch (e) {
            this.logger.error('Failed to get rooms:', e);
            return Result.fail<IRoomDTO[]>(e.toString());
        }
    }

    public async updateRoom(id: string, roomNumber: string, roomType: string): Promise<Result<IRoomDTO>> {
        try {
            const room = await this.roomRepo.findByDomainId(new UniqueEntityID(id));

            if (!room) {
                this.logger.error('Room not found');
                return Result.fail<IRoomDTO>('Room not found');
            }

            room.props.roomName = roomNumber;
            room.props.roomType = roomType;

            await this.roomRepo.save(room);
            this.logger.info('Room updated:', room);

            const roomDTO: IRoomDTO = {
                id: room.id.toString(),
                roomNumber: room.roomName,
                roomType: room.roomType,
            };

            return Result.ok<IRoomDTO>(roomDTO);
        } catch (error) {
            this.logger.error('Error updating room:', error);
            return Result.fail<IRoomDTO>('Error updating room');
        }
    }
}