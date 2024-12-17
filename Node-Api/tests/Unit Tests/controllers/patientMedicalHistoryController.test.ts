import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IPatientMedicalHistoryService from "../../../src/services/IServices/IPatientMedicalHistoryService";
import { IPatientMedicalHistoryDTO } from '../../../src/dto/IPatientMedicalHistoryDTO';
import PatientMedicalHistoryController from '../../../src/controllers/patientMedicalHistoryController';

describe('patient medical history controller', function () {
    let sandbox: sinon.SinonSandbox;
    let patientMedicalHistoryServiceInstance: IPatientMedicalHistoryService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        patientMedicalHistoryServiceInstance = {
            createPatientMedicalHistory: sandbox.stub(),
            updatePatientMedicalHistory: sandbox.stub(),
            getPatientMedicalHistory: sandbox.stub()
        } as unknown as IPatientMedicalHistoryService;

        Container.set('IPatientMedicalHistoryService', patientMedicalHistoryServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createPatientMedicalHistory: returns json with id+details values', async function () {
        let body = {
            patientMedicalRecordNumber: 'PMR123',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            familyHistory: ['Father has heart disease'],
            freeText: 'Patient has a history of diabetes.'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (patientMedicalHistoryServiceInstance.createPatientMedicalHistory as sinon.SinonStub).returns(Result.ok<IPatientMedicalHistoryDTO>({
            id: "1",
            patientMedicalRecordNumber: req.body.patientMedicalRecordNumber,
            medicalConditions: req.body.medicalConditions,
            allergies: req.body.allergies,
            familyHistory: req.body.familyHistory,
            freeText: req.body.freeText
        }));

        const ctrl = new PatientMedicalHistoryController(patientMedicalHistoryServiceInstance);

        await ctrl.createPatientMedicalHistory(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "1",
            patientMedicalRecordNumber: req.body.patientMedicalRecordNumber,
            medicalConditions: req.body.medicalConditions,
            allergies: req.body.allergies,
            familyHistory: req.body.familyHistory,
            freeText: req.body.freeText
        }));
    });

    it('updatePatientMedicalHistory: returns json with updated details', async function () {
        let body = {
            medicalConditions: ['Diabetes', 'Hypertension'],
            allergies: ['Peanuts'],
            familyHistory: ['Father has heart disease'],
            freeText: 'Patient has a history of diabetes and hypertension.'
        };
        let req: Partial<Request> = {};
        req.body = body;
        req.params = { patientMedicalRecordNumber: 'PMR123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (patientMedicalHistoryServiceInstance.updatePatientMedicalHistory as sinon.SinonStub).returns(Result.ok<IPatientMedicalHistoryDTO>({
            id: "1",
            patientMedicalRecordNumber: req.params.patientMedicalRecordNumber,
            medicalConditions: req.body.medicalConditions,
            allergies: req.body.allergies,
            familyHistory: req.body.familyHistory,
            freeText: req.body.freeText
        }));

        const ctrl = new PatientMedicalHistoryController(patientMedicalHistoryServiceInstance);

        await ctrl.updatePatientMedicalHistory(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "1",
            patientMedicalRecordNumber: req.params.patientMedicalRecordNumber,
            medicalConditions: req.body.medicalConditions,
            allergies: req.body.allergies,
            familyHistory: req.body.familyHistory,
            freeText: req.body.freeText
        }));
    });

    it('getPatientMedicalHistory: returns json with patient medical history', async function () {
        let req: Partial<Request> = {};
        req.params = { patientMedicalRecordNumber: 'PMR123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        const patientMedicalHistory = {
            id: "1",
            patientMedicalRecordNumber: 'PMR123',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            familyHistory: ['Father has heart disease'],
            freeText: 'Patient has a history of diabetes.'
        };

        (patientMedicalHistoryServiceInstance.getPatientMedicalHistory as sinon.SinonStub).returns(Result.ok<IPatientMedicalHistoryDTO>(patientMedicalHistory));

        const ctrl = new PatientMedicalHistoryController(patientMedicalHistoryServiceInstance);

        await ctrl.getPatientMedicalHistory(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match(patientMedicalHistory));
    });
});