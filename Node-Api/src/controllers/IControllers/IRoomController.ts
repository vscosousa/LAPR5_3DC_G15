import { Request, Response, NextFunction } from 'express';

export default interface IRoomController {
  createRoom(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getRooms(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateRoom(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}