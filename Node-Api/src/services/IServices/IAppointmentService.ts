import { Result } from "../../core/logic/Result";
import { IAppointmentDTO } from "../../dto/IAppoinmentDTO";

export default interface IAppointmentService {
  createAppointment(appointmentDTO: IAppointmentDTO): Promise<Result<IAppointmentDTO>>;
  updateAppointment(id: string, appointmentDTO: Partial<IAppointmentDTO>): Promise<Result<IAppointmentDTO>>;
}
