export interface IAppointmentPersistence {
  domainId: string;
  requestId: string;
  roomId: string;
  dateTime: string;
  status: string;
  team: string[];
}
