// FILE: AppointmentStatus.ts
export type StatusType = 'scheduled' | 'completed' | 'canceled';

export class AppointmentStatus {
  private readonly value: StatusType;

  private constructor(value: StatusType) {
    this.value = value;
  }

  public static create(value: StatusType): AppointmentStatus {
    if (!['scheduled', 'completed', 'canceled'].includes(value)) {
      throw new Error('Invalid status');
    }
    return new AppointmentStatus(value);
  }

  public getValue(): StatusType {
    return this.value;
  }
}
