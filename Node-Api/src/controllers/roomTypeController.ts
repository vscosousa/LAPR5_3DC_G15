import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from '../core/logic/Result';
import IRoomTypeService from '../services/IServices/IRoomTypeService';
import IRoomTypeController from './IControllers/IRoomTypeController';
import { IRoomTypeDTO } from '../dto/IRoomTypeDTO'; // Import the DTO

@Service()
export default class RoomTypeController implements IRoomTypeController {
  constructor(
    @Inject('RoomTypeService') private roomTypeService: IRoomTypeService
  ) {}

  public async createRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { typeName } = req.body;

      // Validate typeName
      if (!typeName || typeof typeName !== 'string' || typeName.trim() === '') {
        return res.status(400).send('Invalid properties');
      }

      const roomTypeOrError = await this.roomTypeService.createRoomType(typeName);

      if (roomTypeOrError.isFailure) {
        return res.status(400).send(roomTypeOrError.error);
      }

      const roomType = roomTypeOrError.getValue();
      return res.status(201).json({
        id: roomType.id.toString(),
        typeName: roomType.typeName
      });
    } catch (e) {
      return res.status(500).send(e.message);
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
      return next(e);
    }
  }

  public async updateRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { typeName } = req.body;
      const roomTypeOrError = await this.roomTypeService.updateRoomType(id, typeName);

      if (roomTypeOrError.isFailure) {
        return res.status(400).send(roomTypeOrError.errorValue());
      }

      const roomTypeDTO: IRoomTypeDTO = roomTypeOrError.getValue();
      return res.status(200).json(roomTypeDTO);
    } catch (e) {
      return next(e);
    }
  }
}