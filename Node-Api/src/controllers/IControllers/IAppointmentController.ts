import { Request, Response, NextFunction } from 'express';

export default interface IAppointmentController {
  getAppointmentById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getAppointments(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  createAppointment(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  updateAppointment(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}