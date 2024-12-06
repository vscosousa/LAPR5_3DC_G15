import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { PatientMedicalHistoryId } from "./patientMedicalHistoryId";
import { IPatientMedicalHistoryDTO } from '../dto/IPatientMedicalHistoryDTO';

interface PatientMedicalHistoryProps {
  patientMedicalRecordNumber: string;
  medicalConditions: string[];
  allergies: string[];
}

export class PatientMedicalHistory extends AggregateRoot<PatientMedicalHistoryProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get patientMedicalHistoryId(): PatientMedicalHistoryId {
    return new PatientMedicalHistoryId(this.patientMedicalHistoryId.toValue());
  }

  get patientMedicalRecordNumber(): string {
    return this.props.patientMedicalRecordNumber;
  }

  get medicalConditions(): string[] {
    return this.props.medicalConditions;
  }

  get allergies(): string[] {
    return this.props.allergies;
  }

  set medicalConditions(value: string[]) {
    this.props.medicalConditions = value;
  }

  set allergies(value: string[]) {
    this.props.allergies = value;
  }

  private constructor(props: PatientMedicalHistoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(patientMedicalHistoryDTO: IPatientMedicalHistoryDTO, id?: UniqueEntityID): Result<PatientMedicalHistory> {
    const { patientMedicalRecordNumber, medicalConditions, allergies } = patientMedicalHistoryDTO;

    const guardedProps = [
      { argument: patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
      { argument: medicalConditions, argumentName: 'medicalConditions' },
      { argument: allergies, argumentName: 'allergies' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PatientMedicalHistory>(guardResult.message);
    } else {
      const patientMedicalHistory = new PatientMedicalHistory({
        patientMedicalRecordNumber,
        medicalConditions,
        allergies
      }, id);

      return Result.ok<PatientMedicalHistory>(patientMedicalHistory);
    }
  }

  public toString(): string {
    const allergies = this.props.allergies.map(allergy => `- ${allergy}`).join('\n');
    const medicalConditions = this.props.medicalConditions.map(condition => `- ${condition}`).join('\n');
    
    return `Allergies:\n${allergies}\n\nMedical Conditions:\n${medicalConditions}`;
  }
}
