import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import SpecializationService from '../../../src/services/specializationService';
import ISpecializationRepo from '../../../src/services/IRepos/ISpecializationRepo';
import { ISpecializationDTO } from '../../../src/dto/ISpecializationDTO';
import { Specialization } from '../../../src/domain/specialization';
import { SpecializationMap } from '../../../src/mappers/SpecializationMap';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('SpecializationService', function () {
    let sandbox: sinon.SinonSandbox;
    let specializationRepo: sinon.SinonStubbedInstance<ISpecializationRepo>;
    let logger: any;
    let specializationService: SpecializationService;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        specializationRepo = {
            save: sandbox.stub(),
            findbydomainid: sandbox.stub(),
            delete: sandbox.stub(),
            findall: sandbox.stub(),
        } as unknown as sinon.SinonStubbedInstance<ISpecializationRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        specializationService = new SpecializationService(specializationRepo, logger);

        // Mock UniqueEntityID generation
        sandbox.stub(UniqueEntityID.prototype, 'toString').returns('123');
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create a specialization successfully', async function () {
        const specializationDTO: ISpecializationDTO = {
            id: '123',
            specializationType: 'Cardiology'
        };

        const specialization = Specialization.create(specializationDTO).getValue();
        specializationRepo.save.resolves();
        const specializationDTOResult = SpecializationMap.toDTO(specialization);

        const result = await specializationService.createSpecialization(specializationDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(specializationDTOResult);
        sinon.assert.calledOnce(specializationRepo.save);
        sinon.assert.calledWith(logger.info, 'Creating specialization with DTO:', specializationDTO);
    });

    it('should update a specialization successfully', async function () {
        const id = '123';
        const specializationDTO: Partial<ISpecializationDTO> = {
            specializationType: 'Neurology'
        };

        const specialization = Specialization.create({
            id: '123',
            specializationType: 'Cardiology'
        }).getValue();

        specializationRepo.findbydomainid.resolves(specialization);
        specializationRepo.save.resolves();
        specialization.props.specializationType = specializationDTO.specializationType;
        const specializationDTOResult = SpecializationMap.toDTO(specialization);

        const result = await specializationService.updateSpecialization(id, specializationDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(specializationDTOResult);
        sinon.assert.calledOnce(specializationRepo.save);
    });

    it('should remove a specialization successfully', async function () {
        const id = '123';

        const specialization = Specialization.create({
            id: '123',
            specializationType: 'Cardiology'
        }).getValue();

        specializationRepo.findbydomainid.resolves(specialization);
        specializationRepo.delete.resolves();

        const result = await specializationService.removeSpecialization(id);

        expect(result.isSuccess).to.be.true;
        sinon.assert.calledOnce(specializationRepo.delete);
    });

    it('should list all specializations successfully', async function () {
        const specializations = [
            Specialization.create({
                id: '123',
                specializationType: 'Cardiology'
            }).getValue(),
            Specialization.create({
                id: '124',
                specializationType: 'Neurology'
            }).getValue()
        ];

        specializationRepo.findall.resolves(specializations);
        const specializationDTOs = specializations.map(specialization => SpecializationMap.toDTO(specialization));

        const result = await specializationService.listSpecializations();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(specializationDTOs);
        sinon.assert.calledOnce(specializationRepo.findall);
    });
});