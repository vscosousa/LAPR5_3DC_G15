import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import IRoomTypeService from '../services/IServices/IRoomTypeService';
import IRoomTypeController from './IControllers/IRoomTypeController';
import { IRoomTypeDTO } from '../dto/IRoomTypeDTO';

@Service()
export default class RoomTypeController implements IRoomTypeController {
  constructor(
    @Inject('RoomTypeService') private roomTypeService: IRoomTypeService
  ) {}

  public async createRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { typeName, status } = req.body;

      // Validate typeName and status
      if (!typeName || typeof typeName !== 'string' || typeName.trim() === '' ||
          !status || (status !== 'suitable' && status !== 'unsuitable')) {
        return res.status(400).send('Invalid properties');
      }

      const roomTypeOrError = await this.roomTypeService.createRoomType(typeName, status);

      if (roomTypeOrError.isFailure) {
        return res.status(400).send(roomTypeOrError.error);
      }

      const roomType = roomTypeOrError.getValue();
      return res.status(201).json(roomType);
    } catch (e) {
      console.error('Error creating room type:', e);
      return next(e);
    }
  }

  public async getRoomTypes(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const roomTypesOrError = await this.roomTypeService.getRoomTypes();

      if (roomTypesOrError.isFailure) {
        return res.status(400).send(roomTypesOrError.errorValue());
      }

      const roomTypeDTOs: IRoomTypeDTO[] = roomTypesOrError.getValue();
      return res.status(200).json(roomTypeDTOs);
    } catch (e) {
      console.error('Error getting room types:', e);
      return next(e);
    }
  }

  public async updateRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { typeName, status } = req.body;

      // Validate typeName and status
      if (!typeName || typeof typeName !== 'string' || typeName.trim() === '' ||
          !status || (status !== 'suitable' && status !== 'unsuitable')) {
        return res.status(400).send('Invalid properties');
      }

      const roomTypeOrError = await this.roomTypeService.updateRoomType(id, typeName, status);

      if (roomTypeOrError.isFailure) {
        return res.status(400).send(roomTypeOrError.errorValue());
      }

      const roomTypeDTO: IRoomTypeDTO = roomTypeOrError.getValue();
      return res.status(200).json(roomTypeDTO);
    } catch (e) {
      console.error('Error updating room type:', e);
      return next(e);
    }
  }
}