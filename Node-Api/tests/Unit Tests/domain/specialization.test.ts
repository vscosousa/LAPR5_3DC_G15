import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { ISpecializationDTO } from '../../../src/dto/ISpecializationDTO';
import { Specialization } from '../../../src/domain/specialization';

describe('Specialization Domain', () => {
    it('should create a specialization successfully', () => {
        const specializationDTO: ISpecializationDTO = {
            id: '1',
            specializationType: 'Cardiology'
        };

        const result = Specialization.create(specializationDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(Specialization);
        expect(result.getValue().specializationType).to.equal(specializationDTO.specializationType);
    });

    it('should fail to create a specialization with missing properties', () => {
        const specializationDTO: Partial<ISpecializationDTO> = {
            specializationType: ''
        };

        const result = Specialization.create(specializationDTO as ISpecializationDTO);

        expect(result.isFailure).to.be.true;
    });

    it('should create a specialization with a specific id', () => {
        const specializationDTO: ISpecializationDTO = {
            id: '1',
            specializationType: 'Cardiology'
        };

        const id = new UniqueEntityID('1');
        const result = Specialization.create(specializationDTO, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});