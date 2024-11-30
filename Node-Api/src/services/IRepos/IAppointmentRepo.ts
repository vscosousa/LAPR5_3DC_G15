import { Repo } from "../../core/infra/Repo";
import { Appointment } from "../../domain/appointment";
import { AppointmentId } from "../../domain/appointmentId";

export default interface IAppointmentRepo extends Repo<Appointment> {
  save(appointment: Appointment): Promise<Appointment>;
  findByDomainId (appointmentId: AppointmentId | string): Promise<Appointment>;

}
