import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { IAllergyDTO } from '../../../src/dto/IAllergyDTO';
import { Allergy } from '../../../src/domain/allergy';

describe('Allergy Domain', () => {
    it('should create an allergy successfully', () => {
        const allergyDTO: IAllergyDTO = {
            id: '1',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };

        const result = Allergy.create(allergyDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(Allergy);
        expect(result.getValue().allergyCode).to.equal(allergyDTO.allergyCode);
        expect(result.getValue().allergyName).to.equal(allergyDTO.allergyName);
        expect(result.getValue().allergyDescription).to.equal(allergyDTO.allergyDescription);
        expect(result.getValue().allergySymptoms).to.equal(allergyDTO.allergySymptoms);
    });

    it('should fail to create an allergy with missing properties', () => {
        const allergyDTO: Partial<IAllergyDTO> = {
            allergyCode: 'A01',
            allergyName: 'Peanuts'
        };

        const result = Allergy.create(allergyDTO as IAllergyDTO);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get allergy properties', () => {
        const allergyDTO: IAllergyDTO = {
            id: '1',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };

        const result = Allergy.create(allergyDTO);
        const allergy = result.getValue();

        allergy.allergyCode = 'A02';
        allergy.allergyName = 'Dust';
        allergy.allergyDescription = 'Dust allergy';
        allergy.allergySymptoms = 'sneezing, runny nose';

        expect(allergy.allergyCode).to.equal('A02');
        expect(allergy.allergyName).to.equal('Dust');
        expect(allergy.allergyDescription).to.equal('Dust allergy');
        expect(allergy.allergySymptoms).to.equal('sneezing, runny nose');
    });

    it('should create an allergy with a specific id', () => {
        const allergyDTO: IAllergyDTO = {
            id: '1',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };

        const id = new UniqueEntityID('1');
        const result = Allergy.create(allergyDTO, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});