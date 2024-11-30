import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IAppointmentPersistence } from '../dataschema/IAppointmentPersistence';

import IAppointmentRepo from "../services/IRepos/IAppointmentRepo";
import { Appointment } from "../domain/appointment";
import { AppointmentId } from "../domain/appointmentId";
import { AppointmentMap } from "../mappers/AppointmentMap";

@Service()
export default class AppointmentRepo implements IAppointmentRepo {
  private models: any;

  constructor(
    @Inject('appointmentSchema') private appointmentSchema: Model<IAppointmentPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(appointment: Appointment): Promise<boolean> {
    const idX = appointment.id instanceof AppointmentId ? (<AppointmentId>appointment.id).toValue() : appointment.id;

    const query = { domainId: idX };
    const appointmentDocument = await this.appointmentSchema.findOne(query as FilterQuery<IAppointmentPersistence & Document>);

    return !!appointmentDocument === true;
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    const query = { domainId: appointment.id.toString() };

    const appointmentDocument = await this.appointmentSchema.findOne(query);

    try {
      if (appointmentDocument === null) {
        const rawAppointment: any = AppointmentMap.toPersistence(appointment);
        this.logger.info('Creating new appointment:', rawAppointment); // Add logging

        const appointmentCreated = await this.appointmentSchema.create(rawAppointment);

        return AppointmentMap.toDomain(appointmentCreated);
      } else {
        appointmentDocument.requestId = appointment.requestId;
        appointmentDocument.roomId = appointment.roomId;
        appointmentDocument.dateTime = appointment.dateTime.getValue().toISOString();
        appointmentDocument.status = appointment.status.getValue();
        this.logger.info('Updating existing appointment:', appointmentDocument); // Add logging

        await appointmentDocument.save();

        return appointment;
      }
    } catch (err) {
      this.logger.error('Error saving appointment:', err); // Add logging
      throw err;
    }
  }

  public async findByDomainId(appointmentId: AppointmentId | string): Promise<Appointment> {
    const query = { domainId: appointmentId };
    const appointmentRecord = await this.appointmentSchema.findOne(query as FilterQuery<IAppointmentPersistence & Document>);

    if (appointmentRecord != null) {
      return AppointmentMap.toDomain(appointmentRecord);
    } else {
      return null;
    }
  }
}
