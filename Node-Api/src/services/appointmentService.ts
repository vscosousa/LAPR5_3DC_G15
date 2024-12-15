import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import IAppointmentService from './IServices/IAppointmentService';
import IAppointmentRepo from './IRepos/IAppointmentRepo';
import { Appointment } from '../domain/appointment';
import { AppointmentMap } from '../mappers/AppointmentMap';
import { DateTime } from '../domain/dateTime';
import config from '../../config';
import { IAppointmentDTO } from '../dto/IAppoinmentDTO';
import { AppointmentStatus } from '../domain/appointmentStatus';
import https from 'https';

@Service()
export default class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(config.repos.appointment.name) private appointmentRepo: IAppointmentRepo,
    @Inject('logger') private logger,
  ) { }

  public async createAppointment(appointmentDTO: IAppointmentDTO): Promise<Result<IAppointmentDTO>> {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });

    try {
      this.logger.info('Creating appointment with DTO:', appointmentDTO);

      const dateTimeOrError = DateTime.create(appointmentDTO.dateTime.toISOString());
      const statusOrError = AppointmentStatus.create(appointmentDTO.status);

      if (dateTimeOrError instanceof Error) {
        this.logger.error('Error creating DateTime:', dateTimeOrError.message);
        return Result.fail<IAppointmentDTO>(dateTimeOrError.message);
      }

      if (statusOrError instanceof Error) {
        this.logger.error('Error creating AppointmentStatus:', statusOrError.message);
        return Result.fail<IAppointmentDTO>(statusOrError.message);
      }

      console.log('Creating appointment:', appointmentDTO);

      const appointmentOrError = Appointment.create({
        id: appointmentDTO.id,
        requestId: appointmentDTO.requestId,
        roomId: appointmentDTO.roomId,
        dateTime: dateTimeOrError.getValue(),
        status: statusOrError.getValue(),
        team: appointmentDTO.team
      });

      if (appointmentOrError.isFailure) {
        this.logger.error('Error creating Appointment:', appointmentOrError.errorValue());
        return Result.fail<IAppointmentDTO>(appointmentOrError.errorValue());
      }

      const appointment = appointmentOrError.getValue();
      this.logger.info('Saving appointment:', appointment);

      const postData = JSON.stringify({});
      const options = {
        hostname: 'localhost',
        port: 5001,
        path: `/api/OperationRequest/schedule/${appointmentDTO.requestId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        agent: agent
      };

      const url = `https://${options.hostname}:${options.port}${options.path}`;
      console.log(`Request URL: ${url}`);

      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            this.logger.info(`Response status code: ${res.statusCode}`);
            this.logger.info(`Response body: ${body}`);
            if (res.statusCode !== 200) {
              let errorMessage = 'Unknown error';
              if (body) {
                try {
                  errorMessage = JSON.parse(body).message;
                } catch (e) {
                  this.logger.error('Error parsing response body:', e.message);
                }
              }
              this.logger.error('Error scheduling operation request:', errorMessage);
              reject(new Error('Error scheduling operation request'));
            } else {
              resolve(res);
            }
          });
        });

        req.on('error', (e) => {
          this.logger.error('Error in HTTPS request:', e.message);
          reject(e);
        });

        req.write(postData);
        req.end();
      });

      this.logger.info('Operation request scheduled:', response);

      console.log('Saving appointment:', appointment);

      await this.appointmentRepo.save(appointment);

      const appointmentDTOResult = AppointmentMap.toDTO(appointment);
      return Result.ok<IAppointmentDTO>(appointmentDTOResult);
    } catch (e) {
      this.logger.error('Error in createAppointment:', e);
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

      if (appointmentDTO.team) appointment.props.team = appointmentDTO.team;

      await this.appointmentRepo.save(appointment);

      const appointmentDTOResult = AppointmentMap.toDTO(appointment);
      return Result.ok<IAppointmentDTO>(appointmentDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAppointments(): Promise<Result<IAppointmentDTO[]>> {
    try {
      const appointments = await this.appointmentRepo.findall();

      const appointmentDTOs = appointments.map(appointment => AppointmentMap.toDTO(appointment));
      return Result.ok<IAppointmentDTO[]>(appointmentDTOs);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAppointmentById(id: string): Promise<Result<IAppointmentDTO>> {
    try {
      const appointment = await this.appointmentRepo.findByDomainId(id);

      if (!appointment) {
        return Result.fail<IAppointmentDTO>("Appointment not found");
      }

      const appointmentDTO = AppointmentMap.toDTO(appointment);
      return Result.ok<IAppointmentDTO>(appointmentDTO);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}