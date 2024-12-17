import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { IMedicalConditionDTO } from '../../../src/dto/IMedicalConditionDTO';
import { MedicalCondition } from '../../../src/domain/medicalCondition';

describe('MedicalCondition Domain', () => {
    it('should create a medical condition successfully', () => {
        const medicalConditionDTO: IMedicalConditionDTO = {
            id: '1',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Asthma',
            medicalConditionDescription: 'Chronic respiratory condition',
            medicalConditionSymptoms: 'Shortness of breath, wheezing'
        };

        const result = MedicalCondition.create(medicalConditionDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(MedicalCondition);
        expect(result.getValue().medicalConditionCode).to.equal(medicalConditionDTO.medicalConditionCode);
        expect(result.getValue().medicalConditionName).to.equal(medicalConditionDTO.medicalConditionName);
        expect(result.getValue().medicalConditionDescription).to.equal(medicalConditionDTO.medicalConditionDescription);
        expect(result.getValue().medicalConditionSymptoms).to.equal(medicalConditionDTO.medicalConditionSymptoms);
    });

    it('should fail to create a medical condition with missing properties', () => {
        const medicalConditionDTO: Partial<IMedicalConditionDTO> = {
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Asthma'
        };

        const result = MedicalCondition.create(medicalConditionDTO as IMedicalConditionDTO);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get medical condition properties', () => {
        const medicalConditionDTO: IMedicalConditionDTO = {
            id: '1',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Asthma',
            medicalConditionDescription: 'Chronic respiratory condition',
            medicalConditionSymptoms: 'Shortness of breath, wheezing'
        };

        const result = MedicalCondition.create(medicalConditionDTO);
        const medicalCondition = result.getValue();

        medicalCondition.medicalConditionCode = 'MC02';
        medicalCondition.medicalConditionName = 'Diabetes';
        medicalCondition.medicalConditionDescription = 'Chronic condition that affects the way the body processes blood sugar';
        medicalCondition.medicalConditionSymptoms = 'Increased thirst, frequent urination';

        expect(medicalCondition.medicalConditionCode).to.equal('MC02');
        expect(medicalCondition.medicalConditionName).to.equal('Diabetes');
        expect(medicalCondition.medicalConditionDescription).to.equal('Chronic condition that affects the way the body processes blood sugar');
        expect(medicalCondition.medicalConditionSymptoms).to.equal('Increased thirst, frequent urination');
    });

    it('should create a medical condition with a specific id', () => {
        const medicalConditionDTO: IMedicalConditionDTO = {
            id: '1',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Asthma',
            medicalConditionDescription: 'Chronic respiratory condition',
            medicalConditionSymptoms: 'Shortness of breath, wheezing'
        };

        const id = new UniqueEntityID('1');
        const result = MedicalCondition.create(medicalConditionDTO, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});