import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IAppointmentController from "./IControllers/IAppointmentController";
import IAppointmentService from '../services/IServices/IAppointmentService';

import { Result } from "../core/logic/Result";
import { IAppointmentDTO } from '../dto/IAppoinmentDTO';

@Service()
export default class AppointmentController implements IAppointmentController {
  constructor(
      @Inject(config.services.appointment.name) private appointmentServiceInstance : IAppointmentService
  ) {}

  public async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentOrError = await this.appointmentServiceInstance.createAppointment(req.body as IAppointmentDTO) as Result<IAppointmentDTO>;

      if (appointmentOrError.isFailure) {
        return res.status(400).send(appointmentOrError.errorValue());
      }

      const appointmentDTO = appointmentOrError.getValue();
      return res.status(201).json(appointmentDTO);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appointmentOrError = await this.appointmentServiceInstance.updateAppointment(id, req.body as Partial<IAppointmentDTO>) as Result<IAppointmentDTO>;

      if (appointmentOrError.isFailure) {
        return res.status(400).send(appointmentOrError.errorValue());
      }

      const appointmentDTO = appointmentOrError.getValue();
      return res.status(200).json(appointmentDTO);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await this.appointmentServiceInstance.getAppointments();
      return res.status(200).json(appointments);
    }
    catch (e) {
      return next(e);
    }
  }

  public async getAppointmentById(req: any, res: any, next: any) {
    const appointmentId = req.params.id;
    console.log('Fetching appointment with id:', appointmentId);
  
    try {
      const appointment = await this.appointmentServiceInstance.getAppointmentById(appointmentId);
      if (!appointment) {
        console.error('No appointment found with id:', appointmentId);
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      console.log('Successfully fetched appointment with id:', appointmentId, appointment);
  
      res.locals.data = appointment;
      res.status(200).json(appointment);
    } catch (error) {
      console.error('Error fetching appointment with id:', appointmentId, error);
      next(error);
    }
  }
}
