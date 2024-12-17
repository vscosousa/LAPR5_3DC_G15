import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import ISpecializationService from "../../../src/services/IServices/ISpecializationService";
import { ISpecializationDTO } from '../../../src/dto/ISpecializationDTO';
import SpecializationController from '../../../src/controllers/specializationController';

describe('specialization controller', function () {
    let sandbox: sinon.SinonSandbox;
    let specializationServiceInstance: ISpecializationService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        specializationServiceInstance = {
            createSpecialization: sandbox.stub(),
            updateSpecialization: sandbox.stub(),
            removeSpecialization: sandbox.stub(),
            listSpecializations: sandbox.stub()
        } as unknown as ISpecializationService;

        Container.set('ISpecializationService', specializationServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createSpecialization: returns json with id+details values', async function () {
        let body = {
            specializationType: 'Cardiology'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (specializationServiceInstance.createSpecialization as sinon.SinonStub).returns(Result.ok<ISpecializationDTO>({
            id: "1",
            specializationType: req.body.specializationType
        }));

        const ctrl = new SpecializationController(specializationServiceInstance);

        await ctrl.createSpecialization(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "1",
            specializationType: req.body.specializationType
        }));
    });

    it('updateSpecialization: returns json with updated details', async function () {
        let body = {
            specializationType: 'Neurology'
        };
        let req: Partial<Request> = {};
        req.body = body;
        req.params = { id: '1' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (specializationServiceInstance.updateSpecialization as sinon.SinonStub).returns(Result.ok<ISpecializationDTO>({
            id: req.params.id,
            specializationType: req.body.specializationType
        }));

        const ctrl = new SpecializationController(specializationServiceInstance);

        await ctrl.updateSpecialization(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: req.params.id,
            specializationType: req.body.specializationType
        }));
    });

    it('deleteSpecialization: returns success message', async function () {
        let req: Partial<Request> = {};
        req.params = { id: '1' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        (specializationServiceInstance.removeSpecialization as sinon.SinonStub).returns(Result.ok<void>());

        const ctrl = new SpecializationController(specializationServiceInstance);

        await ctrl.deleteSpecialization(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.send as sinon.SinonSpy);
        sinon.assert.calledWith(res.send as sinon.SinonSpy, sinon.match({ message: "Specialization successfully deleted." }));
    });

    it('listSpecializations: returns json with list of specializations', async function () {
        let req: Partial<Request> = {};

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        const specializations = [
            { id: '1', specializationType: 'Cardiology' },
            { id: '2', specializationType: 'Neurology' }
        ];

        (specializationServiceInstance.listSpecializations as sinon.SinonStub).returns(Result.ok<ISpecializationDTO[]>(specializations));

        const ctrl = new SpecializationController(specializationServiceInstance);

        await ctrl.listSpecializations(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({ _value: specializations }));
    });
});