import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import IAppointmentService from './IServices/IAppointmentService';
import IAppointmentRepo from './IRepos/IAppointmentRepo';
import { Appointment } from '../domain/appointment';
import { AppointmentMap } from '../mappers/AppointmentMap';
import { DateTime } from '../domain/DateTime';
import config from '../../config';
import { IAppointmentDTO } from '../dto/IAppoinmentDTO';
import { AppointmentStatus } from '../domain/appointmentStatus';

@Service()
export default class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(config.repos.appointment.name) private appointmentRepo: IAppointmentRepo,
    @Inject('logger') private logger,
  ) {}

  public async createAppointment(appointmentDTO: IAppointmentDTO): Promise<Result<IAppointmentDTO>> {
    try {
      this.logger.info('Creating appointment with DTO:', appointmentDTO); // Add logging

      const dateTimeOrError = DateTime.create(appointmentDTO.dateTime.toISOString());
      const statusOrError = AppointmentStatus.create(appointmentDTO.status);

      if (dateTimeOrError instanceof Error) {
        this.logger.error('Error creating DateTime:', dateTimeOrError.message); // Add logging
        return Result.fail<IAppointmentDTO>(dateTimeOrError.message);
      }

      if (statusOrError instanceof Error) {
        this.logger.error('Error creating AppointmentStatus:', statusOrError.message); // Add logging
        return Result.fail<IAppointmentDTO>(statusOrError.message);
      }

      const appointmentOrError = Appointment.create({
        id: appointmentDTO.id,
        requestId: appointmentDTO.requestId,
        roomId: appointmentDTO.roomId,
        dateTime: dateTimeOrError.getValue(),
        status: statusOrError.getValue(),
      });

      if (appointmentOrError.isFailure) {
        this.logger.error('Error creating Appointment:', appointmentOrError.errorValue()); // Add logging
        return Result.fail<IAppointmentDTO>(appointmentOrError.errorValue());
      }

      const appointment = appointmentOrError.getValue();
      this.logger.info('Saving appointment:', appointment); // Add logging
      await this.appointmentRepo.save(appointment);

      const appointmentDTOResult = AppointmentMap.toDTO(appointment);
      return Result.ok<IAppointmentDTO>(appointmentDTOResult);
    } catch (e) {
      this.logger.error('Error in createAppointment:', e); // Add logging
      throw e;
    }
  }

  public async updateAppointment(id: string, appointmentDTO: Partial<IAppointmentDTO>): Promise<Result<IAppointmentDTO>> {
    try {
      const appointment = await this.appointmentRepo.findByDomainId(id);

      if (!appointment) {
        return Result.fail<IAppointmentDTO>("Appointment not found");
      }

      if (appointmentDTO.requestId) appointment.props.requestId = appointmentDTO.requestId;
      if (appointmentDTO.roomId) appointment.props.roomId = appointmentDTO.roomId;
      if (appointmentDTO.dateTime) {
        const dateTimeOrError = DateTime.create(appointmentDTO.dateTime.toISOString());
        if (dateTimeOrError instanceof Error) {
          return Result.fail<IAppointmentDTO>(dateTimeOrError.message);
        }
        appointment.props.dateTime = dateTimeOrError;
      }
      if (appointmentDTO.status) {
        const statusOrError = AppointmentStatus.create(appointmentDTO.status);
        if (statusOrError instanceof Error) {
          return Result.fail<IAppointmentDTO>(statusOrError.message);
        }
        appointment.props.status = statusOrError;
      }

      await this.appointmentRepo.save(appointment);

      const appointmentDTOResult = AppointmentMap.toDTO(appointment);
      return Result.ok<IAppointmentDTO>(appointmentDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
