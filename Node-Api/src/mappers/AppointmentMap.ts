import { Mapper } from "../core/infra/Mapper";
import { Appointment } from "../domain/appointment";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DateTime } from "../domain/dateTime";
import { AppointmentStatus } from "../domain/appointmentStatus";
import { IAppointmentDTO } from "../dto/IAppoinmentDTO";
import { IAppointmentPersistence } from "../dataschema/IAppointmentPersistence";
import { Document, Model } from "mongoose";

export class AppointmentMap extends Mapper<Appointment> {

  public static toDTO(appointment: any): IAppointmentDTO {
    return {
      id: appointment.id.toString(),
      requestId: appointment.requestId,
      roomId: appointment.roomId,
      dateTime: new Date(appointment.dateTime),
      status: appointment.status
    };
  }

  public static toDomain (appointment: any | Model<IAppointmentPersistence & Document> ): Appointment {
    const roleOrError = Appointment.create(
      appointment,
      new UniqueEntityID(appointment.domainId)
    );

    roleOrError.isFailure ? console.log(roleOrError.error) : '';

    return roleOrError.isSuccess ? roleOrError.getValue() : null;
  }

  public static toPersistence(appointment: Appointment): any {
    return {
      domainId: appointment.id.toString(),
      requestId: appointment.requestId,
      roomId: appointment.roomId,
      dateTime: appointment.dateTime.getValue().toISOString(),
      status: appointment.status.getValue()
    };
  }
}
