import { AppointmentStatus, StatusType } from './appointmentStatus';
import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { AppointmentId } from "./appointmentId";
import { DateTime } from './DateTime';
import { IAppointmentDTO } from '../dto/IAppoinmentDTO';

interface AppointmentProps {
  requestId: string;
  roomId: string;
  dateTime: DateTime;
  status: AppointmentStatus;
}

export class Appointment extends AggregateRoot<AppointmentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get appointmentId(): AppointmentId {
    return new AppointmentId(this.appointmentId.toValue());
  }

  get requestId(): string {
    return this.props.requestId;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get dateTime(): DateTime {
    return this.props.dateTime;
  }

  get status(): AppointmentStatus {
    return this.props.status;
  }

  set status(value: AppointmentStatus) {
    this.props.status = value;
  }

  private constructor(props: AppointmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(appointmentDTO: IAppointmentDTO, id?: UniqueEntityID): Result<Appointment> {
    const { requestId, roomId, dateTime, status } = appointmentDTO;

    const guardedProps = [
      { argument: requestId, argumentName: 'requestId' },
      { argument: roomId, argumentName: 'roomId' },
      { argument: dateTime, argumentName: 'dateTime' },
      { argument: status, argumentName: 'status' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Appointment>(guardResult.message);
    } else {
      const appointment = new Appointment({
        requestId,
        roomId,
        dateTime: DateTime.create(dateTime.toISOString()),
        status: AppointmentStatus.create(status)
      }, id);

      return Result.ok<Appointment>(appointment);
    }
  }
}
