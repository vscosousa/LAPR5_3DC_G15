import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { IPatientMedicalHistoryDTO } from '../../../src/dto/IPatientMedicalHistoryDTO';
import { PatientMedicalHistory } from '../../../src/domain/patientMedicalHistory';

describe('PatientMedicalHistory Domain', () => {
    it('should create a patient medical history successfully', () => {
        const patientMedicalHistoryDTO: IPatientMedicalHistoryDTO = {
            id: '1',
            patientMedicalRecordNumber: 'PMR001',
            medicalConditions: ['Condition A'],
            allergies: ['Allergy A'],
            familyHistory: ['Family History A'],
            freeText: 'Free text'
        };

        const result = PatientMedicalHistory.create(patientMedicalHistoryDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(PatientMedicalHistory);
        expect(result.getValue().patientMedicalRecordNumber).to.equal(patientMedicalHistoryDTO.patientMedicalRecordNumber);
        expect(result.getValue().medicalConditions).to.deep.equal(patientMedicalHistoryDTO.medicalConditions);
        expect(result.getValue().allergies).to.deep.equal(patientMedicalHistoryDTO.allergies);
        expect(result.getValue().familyHistory).to.deep.equal(patientMedicalHistoryDTO.familyHistory);
        expect(result.getValue().freeText).to.equal(patientMedicalHistoryDTO.freeText);
    });

    it('should fail to create a patient medical history with missing properties', () => {
        const patientMedicalHistoryDTO: Partial<IPatientMedicalHistoryDTO> = {
            patientMedicalRecordNumber: 'PMR001',
            medicalConditions: ['Condition A']
        };

        const result = PatientMedicalHistory.create(patientMedicalHistoryDTO as IPatientMedicalHistoryDTO);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get patient medical history properties', () => {
        const patientMedicalHistoryDTO: IPatientMedicalHistoryDTO = {
            id: '1',
            patientMedicalRecordNumber: 'PMR001',
            medicalConditions: ['Condition A'],
            allergies: ['Allergy A'],
            familyHistory: ['Family History A'],
            freeText: 'Free text'
        };

        const result = PatientMedicalHistory.create(patientMedicalHistoryDTO);
        const patientMedicalHistory = result.getValue();

        patientMedicalHistory.medicalConditions = ['Condition B'];
        patientMedicalHistory.allergies = ['Allergy B'];
        patientMedicalHistory.familyHistory = ['Family History B'];
        patientMedicalHistory.freeText = 'Updated free text';

        expect(patientMedicalHistory.patientMedicalRecordNumber).to.equal(patientMedicalHistoryDTO.patientMedicalRecordNumber);
        expect(patientMedicalHistory.medicalConditions).to.deep.equal(['Condition B']);
        expect(patientMedicalHistory.allergies).to.deep.equal(['Allergy B']);
        expect(patientMedicalHistory.familyHistory).to.deep.equal(['Family History B']);
        expect(patientMedicalHistory.freeText).to.equal('Updated free text');
    });

    it('should create a patient medical history with a specific id', () => {
        const patientMedicalHistoryDTO: IPatientMedicalHistoryDTO = {
            id: '1',
            patientMedicalRecordNumber: 'PMR001',
            medicalConditions: ['Condition A'],
            allergies: ['Allergy A'],
            familyHistory: ['Family History A'],
            freeText: 'Free text'
        };

        const id = new UniqueEntityID('1');
        const result = PatientMedicalHistory.create(patientMedicalHistoryDTO, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});