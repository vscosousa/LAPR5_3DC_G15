import { Request, Response, NextFunction } from 'express';

export default interface IRoomTypeController {
  createRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getRoomTypes(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateRoomType(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
