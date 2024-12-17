import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import MedicalConditionService from '../../../src/services/medicalConditionService';
import IMedicalConditionRepo from '../../../src/services/IRepos/IMedicalConditionRepo';
import { IMedicalConditionDTO } from '../../../src/dto/IMedicalConditionDTO';
import { MedicalCondition } from '../../../src/domain/medicalCondition';
import { MedicalConditionMap } from '../../../src/mappers/MedicalConditionMap';

describe('MedicalConditionService', function () {
    let sandbox: sinon.SinonSandbox;
    let medicalConditionRepo: sinon.SinonStubbedInstance<IMedicalConditionRepo>;
    let logger: any;
    let medicalConditionService: MedicalConditionService;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        medicalConditionRepo = {
            save: sandbox.stub(),
            findbydomainid: sandbox.stub(),
            delete: sandbox.stub(),
            findall: sandbox.stub()
        } as unknown as sinon.SinonStubbedInstance<IMedicalConditionRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        medicalConditionService = new MedicalConditionService(medicalConditionRepo, logger);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create a medical condition successfully', async function () {
        const medicalConditionDTO: IMedicalConditionDTO = {
            id: '123',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Diabetes description',
            medicalConditionSymptoms: 'Increased thirst, frequent urination'
        };

        const medicalCondition = MedicalCondition.create(medicalConditionDTO).getValue();
        medicalConditionRepo.save.resolves();
        const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition);

        const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(medicalConditionDTOResult);
        sinon.assert.calledOnce(medicalConditionRepo.save);
        sinon.assert.calledWith(logger.info, 'Creating medicalCondition with DTO:', medicalConditionDTO);
    });

    it('should update a medical condition successfully', async function () {
        const id = '123';
        const medicalConditionDTO: Partial<IMedicalConditionDTO> = {
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Severe diabetes',
            medicalConditionSymptoms: 'Increased thirst, frequent urination'
        };

        const medicalCondition = MedicalCondition.create({
            id: '123',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Diabetes description',
            medicalConditionSymptoms: 'Increased thirst, frequent urination'
        }).getValue();

        medicalConditionRepo.findbydomainid.resolves(medicalCondition);
        medicalConditionRepo.save.resolves();
        const updatedMedicalCondition = MedicalCondition.create({
            id: '123',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Severe diabetes',
            medicalConditionSymptoms: 'Increased thirst, frequent urination'
        }).getValue();
        const medicalConditionDTOResult = MedicalConditionMap.toDTO(updatedMedicalCondition);

        const result = await medicalConditionService.updateMedicalCondition(id, medicalConditionDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(medicalConditionDTOResult);
        sinon.assert.calledOnce(medicalConditionRepo.save);
    });

    it('should remove a medical condition successfully', async function () {
        const id = '123';

        const medicalCondition = MedicalCondition.create({
            id: '123',
            medicalConditionCode: 'MC01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Diabetes description',
            medicalConditionSymptoms: 'Increased thirst, frequent urination'
        }).getValue();

        medicalConditionRepo.findbydomainid.resolves(medicalCondition);
        medicalConditionRepo.delete.resolves();

        const result = await medicalConditionService.removeMedicalCondition(id);

        expect(result.isSuccess).to.be.true;
        sinon.assert.calledOnce(medicalConditionRepo.delete);
    });

    it('should list all medical conditions successfully', async function () {
        const medicalConditions = [
            MedicalCondition.create({
                id: '123',
                medicalConditionCode: 'MC01',
                medicalConditionName: 'Diabetes',
                medicalConditionDescription: 'Diabetes description',
                medicalConditionSymptoms: 'Increased thirst, frequent urination'
            }).getValue(),
            MedicalCondition.create({
                id: '124',
                medicalConditionCode: 'MC02',
                medicalConditionName: 'Hypertension',
                medicalConditionDescription: 'Hypertension description',
                medicalConditionSymptoms: 'Headache, dizziness'
            }).getValue()
        ];

        medicalConditionRepo.findall.resolves(medicalConditions);
        const medicalConditionDTOs = medicalConditions.map(medicalCondition => MedicalConditionMap.toDTO(medicalCondition));

        const result = await medicalConditionService.listMedicalConditions();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(medicalConditionDTOs);
        sinon.assert.calledOnce(medicalConditionRepo.findall);
    });
});