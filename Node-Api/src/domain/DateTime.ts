// FILE: DateTime.ts
export class DateTime {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  public static create(value: string): DateTime {
    const date = new Date(value);
    if (!value || isNaN(date.getTime())) {
      throw new Error('Invalid date and time');
    }
    return new DateTime(date);
  }

  public getValue(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString();
  }
}
