import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from '../core/logic/Result';
import IRoomService from '../services/IServices/IRoomService';
import IRoomController from './IControllers/IRoomController';
import { IRoomDTO } from '../dto/IRoomDTO';

@Service()
export default class RoomController implements IRoomController {
  constructor(
    @Inject('RoomService') private roomService: IRoomService
  ) {}

  public async createRoom(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { roomNumber, roomType } = req.body;

      // Validate roomNumber and roomType
      if (!roomNumber || typeof roomNumber !== 'string' || roomNumber.trim() === '' ||
          !roomType || typeof roomType !== 'string' || roomType.trim() === '') {
        return res.status(400).send('Invalid properties');
      }

      const roomOrError = await this.roomService.createRoom(roomNumber, roomType);

      if (roomOrError.isFailure) {
        return res.status(400).send(roomOrError.error);
      }

      const room = roomOrError.getValue();
      return res.status(201).json({
        id: room.id.toString(),
        roomNumber: room.roomNumber,
        roomType: room.roomType
      });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

  public async getRooms(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const roomsOrError = await this.roomService.getRooms();

      if (roomsOrError.isFailure) {
        return res.status(400).send(roomsOrError.errorValue());
      }

      const roomDTOs: IRoomDTO[] = roomsOrError.getValue();
      return res.status(200).json(roomDTOs);
    } catch (e) {
      return next(e);
    }
  }

  public async updateRoom(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { roomNumber, roomType } = req.body;
      const roomOrError = await this.roomService.updateRoom(id, roomNumber, roomType);

      if (roomOrError.isFailure) {
        return res.status(400).send(roomOrError.errorValue());
      }

      const roomDTO: IRoomDTO = roomOrError.getValue();
      return res.status(200).json(roomDTO);
    } catch (e) {
      return next(e);
    }
  }
}