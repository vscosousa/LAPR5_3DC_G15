export interface IAppointmentDTO {
  id: string;
  requestId: string;
  roomId: string;
  dateTime: Date;
  status: 'scheduled' | 'completed' | 'canceled';
}
