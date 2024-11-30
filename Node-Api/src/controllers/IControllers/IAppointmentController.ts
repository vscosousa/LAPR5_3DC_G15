import { Request, Response, NextFunction } from 'express';

export default interface IAppointmentController {
  createAppointment(req: Request, res: Response, next: NextFunction);
  updateAppointment(req: Request, res: Response, next: NextFunction);
}
