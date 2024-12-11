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
  familyHistory: string[];
  freeText: string;
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

  get familyHistory(): string[] {
    return this.props.familyHistory;
  }

  set familyHistory(value: string[]) {
    this.props.familyHistory = value;
  }

  get freeText(): string {
    return this.props.freeText;
  }

  set freeText(value: string) {
    this.props.freeText = value;
  }

  private constructor(props: PatientMedicalHistoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(patientMedicalHistoryDTO: IPatientMedicalHistoryDTO, id?: UniqueEntityID): Result<PatientMedicalHistory> {
    const { patientMedicalRecordNumber, medicalConditions, allergies , familyHistory, freeText } = patientMedicalHistoryDTO;

    const guardedProps = [
      { argument: patientMedicalRecordNumber, argumentName: 'patientMedicalRecordNumber' },
      { argument: medicalConditions, argumentName: 'medicalConditions' },
      { argument: allergies, argumentName: 'allergies' },
      { argument: familyHistory, argumentName: 'familyHistory' },
      { argument: freeText, argumentName: 'freeText' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PatientMedicalHistory>(guardResult.message);
    } else {
      const patientMedicalHistory = new PatientMedicalHistory({
        patientMedicalRecordNumber,
        medicalConditions,
        allergies,
        familyHistory,
        freeText
      }, id);

      return Result.ok<PatientMedicalHistory>(patientMedicalHistory);
    }
  }

  public toString(): string {
    const allergies = this.props.allergies.map(allergy => `- ${allergy}`).join('\n');
    const medicalConditions = this.props.medicalConditions.map(condition => `- ${condition}`).join('\n');
    const familyHistory = this.props.familyHistory.map(familyMember => `- ${familyMember.toString()}`).join('\n');
    const freeText = this.props.freeText;
    
    return `Allergies:\n${allergies}\n\nMedical Conditions:\n${medicalConditions}\n\nFamily History:\n${familyHistory}\n\nFree Text:\n${freeText}`;
  }
}
