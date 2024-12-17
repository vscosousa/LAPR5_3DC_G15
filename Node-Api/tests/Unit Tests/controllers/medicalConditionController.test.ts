import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IMedicalConditionService from "../../../src/services/IServices/IMedicalConditionService";
import { IMedicalConditionDTO } from '../../../src/dto/IMedicalConditionDTO';
import MedicalConditionController from '../../../src/controllers/medicalConditionController';

describe('medical condition controller', function () {
    let sandbox: sinon.SinonSandbox;
    let medicalConditionServiceInstance: IMedicalConditionService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        medicalConditionServiceInstance = {
            createMedicalCondition: sandbox.stub(),
            updateMedicalCondition: sandbox.stub(),
            removeMedicalCondition: sandbox.stub(),
            listMedicalConditions: sandbox.stub()
        } as unknown as IMedicalConditionService;

        Container.set('IMedicalConditionService', medicalConditionServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createMedicalCondition: returns json with id+details values', async function () {
        let body = {
            medicalConditionCode: 'C01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Diabetes mellitus',
            medicalConditionSymptoms: 'increased thirst, frequent urination'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (medicalConditionServiceInstance.createMedicalCondition as sinon.SinonStub).returns(Result.ok<IMedicalConditionDTO>({
            id: "123",
            medicalConditionCode: req.body.medicalConditionCode,
            medicalConditionName: req.body.medicalConditionName,
            medicalConditionDescription: req.body.medicalConditionDescription,
            medicalConditionSymptoms: req.body.medicalConditionSymptoms
        }));

        const ctrl = new MedicalConditionController(medicalConditionServiceInstance);

        await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "123",
            medicalConditionCode: req.body.medicalConditionCode,
            medicalConditionName: req.body.medicalConditionName,
            medicalConditionDescription: req.body.medicalConditionDescription,
            medicalConditionSymptoms: req.body.medicalConditionSymptoms
        }));
    });

    it('updateMedicalCondition: returns json with updated details', async function () {
        let body = {
            medicalConditionCode: 'C01',
            medicalConditionName: 'Diabetes',
            medicalConditionDescription: 'Severe diabetes mellitus',
            medicalConditionSymptoms: 'increased thirst, frequent urination'
        };
        let req: Partial<Request> = {};
        req.body = body;
        req.params = { id: '123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (medicalConditionServiceInstance.updateMedicalCondition as sinon.SinonStub).returns(Result.ok<IMedicalConditionDTO>({
            id: req.params.id,
            medicalConditionCode: req.body.medicalConditionCode,
            medicalConditionName: req.body.medicalConditionName,
            medicalConditionDescription: req.body.medicalConditionDescription,
            medicalConditionSymptoms: req.body.medicalConditionSymptoms
        }));

        const ctrl = new MedicalConditionController(medicalConditionServiceInstance);

        await ctrl.updateMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: req.params.id,
            medicalConditionCode: req.body.medicalConditionCode,
            medicalConditionName: req.body.medicalConditionName,
            medicalConditionDescription: req.body.medicalConditionDescription,
            medicalConditionSymptoms: req.body.medicalConditionSymptoms
        }));
    });

    it('deleteMedicalCondition: returns success message', async function () {
        let req: Partial<Request> = {};
        req.params = { id: '123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        (medicalConditionServiceInstance.removeMedicalCondition as sinon.SinonStub).returns(Result.ok<void>());

        const ctrl = new MedicalConditionController(medicalConditionServiceInstance);

        await ctrl.deleteMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.send as sinon.SinonSpy);
        sinon.assert.calledWith(res.send as sinon.SinonSpy, sinon.match({ message: "MedicalCondition successfully deleted." }));
    });

    it('listMedicalConditions: returns json with list of medical conditions', async function () {
        let req: Partial<Request> = {};

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        const medicalConditions = [
            { id: '123', medicalConditionCode: 'C01', medicalConditionName: 'Diabetes', medicalConditionDescription: 'Diabetes mellitus', medicalConditionSymptoms: 'increased thirst, frequent urination' },
            { id: '124', medicalConditionCode: 'C02', medicalConditionName: 'Hypertension', medicalConditionDescription: 'High blood pressure', medicalConditionSymptoms: 'headache, dizziness' }
        ];

        (medicalConditionServiceInstance.listMedicalConditions as sinon.SinonStub).returns(Result.ok<IMedicalConditionDTO[]>(medicalConditions));

        const ctrl = new MedicalConditionController(medicalConditionServiceInstance);

        await ctrl.listMedicalConditions(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({ _value: medicalConditions }));
    });
});