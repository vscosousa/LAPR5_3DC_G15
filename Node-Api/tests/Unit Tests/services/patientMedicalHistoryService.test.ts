import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import PatientMedicalHistoryService from '../../../src/services/patientMedicalHistoryService';
import IPatientMedicalHistoryRepo from '../../../src/services/IRepos/IPatientMedicalHistoryRepo';
import { IPatientMedicalHistoryDTO } from '../../../src/dto/IPatientMedicalHistoryDTO';
import { PatientMedicalHistory } from '../../../src/domain/patientMedicalHistory';
import { PatientMedicalHistoryMap } from '../../../src/mappers/PatientMedicalHistoryMap';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('PatientMedicalHistoryService', function () {
    let sandbox: sinon.SinonSandbox;
    let patientMedicalHistoryRepo: sinon.SinonStubbedInstance<IPatientMedicalHistoryRepo>;
    let logger: any;
    let patientMedicalHistoryService: PatientMedicalHistoryService;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        patientMedicalHistoryRepo = {
            save: sandbox.stub(),
            findByPatientMedicalRecordNumber: sandbox.stub(),
        } as unknown as sinon.SinonStubbedInstance<IPatientMedicalHistoryRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        patientMedicalHistoryService = new PatientMedicalHistoryService(patientMedicalHistoryRepo, logger);

        // Mock UniqueEntityID generation
        sandbox.stub(UniqueEntityID.prototype, 'toString').returns('123');
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create a patient medical history successfully', async function () {
        const patientMedicalHistoryDTO: IPatientMedicalHistoryDTO = {
            id: '123',
            patientMedicalRecordNumber: 'MRN001',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            familyHistory: ['Family history of diabetes'],
            freeText: 'Additional notes'
        };

        const patientMedicalHistory = PatientMedicalHistory.create(patientMedicalHistoryDTO).getValue();
        patientMedicalHistoryRepo.save.resolves();
        const patientMedicalHistoryDTOResult = PatientMedicalHistoryMap.toDTO(patientMedicalHistory);

        const result = await patientMedicalHistoryService.createPatientMedicalHistory(patientMedicalHistoryDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(patientMedicalHistoryDTOResult);
        sinon.assert.calledOnce(patientMedicalHistoryRepo.save);
        sinon.assert.calledWith(logger.info, 'Creating patientMedicalHistory with DTO:', patientMedicalHistoryDTO);
    });

    it('should update a patient medical history successfully', async function () {
        const patientMedicalRecordNumber = 'MRN001';
        const patientMedicalHistoryDTO: Partial<IPatientMedicalHistoryDTO> = {
            medicalConditions: ['Severe Diabetes'],
            allergies: ['Dust'],
            familyHistory: ['Family history of severe diabetes'],
            freeText: 'Updated notes'
        };

        const patientMedicalHistory = PatientMedicalHistory.create({
            id: '123',
            patientMedicalRecordNumber: 'MRN001',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            familyHistory: ['Family history of diabetes'],
            freeText: 'Additional notes'
        }).getValue();

        patientMedicalHistoryRepo.findByPatientMedicalRecordNumber.resolves(patientMedicalHistory);
        patientMedicalHistoryRepo.save.resolves();
        const updatedPatientMedicalHistory = PatientMedicalHistory.create({
            id: '123',
            patientMedicalRecordNumber: 'MRN001',
            medicalConditions: ['Severe Diabetes'],
            allergies: ['Dust'],
            familyHistory: ['Family history of severe diabetes'],
            freeText: 'Updated notes'
        }).getValue();
        const patientMedicalHistoryDTOResult = PatientMedicalHistoryMap.toDTO(updatedPatientMedicalHistory);

        const result = await patientMedicalHistoryService.updatePatientMedicalHistory(patientMedicalRecordNumber, patientMedicalHistoryDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(patientMedicalHistoryDTOResult);
        sinon.assert.calledOnce(patientMedicalHistoryRepo.save);
        sinon.assert.calledWith(logger.info, 'Updating patientMedicalHistory with record number:', patientMedicalRecordNumber);
    });

    it('should get a patient medical history successfully', async function () {
        const patientMedicalRecordNumber = 'MRN001';

        const patientMedicalHistory = PatientMedicalHistory.create({
            id: '123',
            patientMedicalRecordNumber: 'MRN001',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            familyHistory: ['Family history of diabetes'],
            freeText: 'Additional notes'
        }).getValue();

        patientMedicalHistoryRepo.findByPatientMedicalRecordNumber.resolves(patientMedicalHistory);
        const patientMedicalHistoryDTOResult = PatientMedicalHistoryMap.toDTO(patientMedicalHistory);

        const result = await patientMedicalHistoryService.getPatientMedicalHistory(patientMedicalRecordNumber);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(patientMedicalHistoryDTOResult);
        sinon.assert.calledOnce(patientMedicalHistoryRepo.findByPatientMedicalRecordNumber);
    });
});