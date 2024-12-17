import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IAllergyService from "../../../src/services/IServices/IAllergyService";
import { IAllergyDTO } from '../../../src/dto/IAllergyDTO';
import AllergyController from '../../../src/controllers/allergyController';

describe('allergy controller', function () {
    let sandbox: sinon.SinonSandbox;
    let allergyServiceInstance: IAllergyService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        allergyServiceInstance = {
            createAllergy: sandbox.stub(),
            updateAllergy: sandbox.stub(),
            removeAllergy: sandbox.stub(),
            listAllergys: sandbox.stub()
        } as unknown as IAllergyService;

        Container.set('IAllergyService', allergyServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createAllergy: returns json with id+details values', async function () {
        let body = {
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (allergyServiceInstance.createAllergy as sinon.SinonStub).returns(Result.ok<IAllergyDTO>({
            id: "123",
            allergyCode: req.body.allergyCode,
            allergyName: req.body.allergyName,
            allergyDescription: req.body.allergyDescription,
            allergySymptoms: req.body.allergySymptoms
        }));

        const ctrl = new AllergyController(allergyServiceInstance);

        await ctrl.createAllergy(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "123",
            allergyCode: req.body.allergyCode,
            allergyName: req.body.allergyName,
            allergyDescription: req.body.allergyDescription,
            allergySymptoms: req.body.allergySymptoms
        }));
    });

    it('updateAllergy: returns json with updated details', async function () {
        let body = {
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Severe peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };
        let req: Partial<Request> = {};
        req.body = body;
        req.params = { id: '123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (allergyServiceInstance.updateAllergy as sinon.SinonStub).returns(Result.ok<IAllergyDTO>({
            id: req.params.id,
            allergyCode: req.body.allergyCode,
            allergyName: req.body.allergyName,
            allergyDescription: req.body.allergyDescription,
            allergySymptoms: req.body.allergySymptoms
        }));

        const ctrl = new AllergyController(allergyServiceInstance);

        await ctrl.updateAllergy(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: req.params.id,
            allergyCode: req.body.allergyCode,
            allergyName: req.body.allergyName,
            allergyDescription: req.body.allergyDescription,
            allergySymptoms: req.body.allergySymptoms
        }));
    });

    it('deleteAllergy: returns success message', async function () {
        let req: Partial<Request> = {};
        req.params = { id: '123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        (allergyServiceInstance.removeAllergy as sinon.SinonStub).returns(Result.ok<void>());

        const ctrl = new AllergyController(allergyServiceInstance);

        await ctrl.deleteAllergy(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 204);
        sinon.assert.calledOnce(res.send as sinon.SinonSpy);
    });

    it('listAllergies: returns json with list of allergies', async function () {
        let req: Partial<Request> = {};
    
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};
    
        const allergies = [
            { id: '123', allergyCode: 'A01', allergyName: 'Peanuts', allergyDescription: 'Peanut allergy', allergySymptoms: 'itchy skin, swelling, rash' },
            { id: '124', allergyCode: 'B02', allergyName: 'Dust', allergyDescription: 'Dust allergy', allergySymptoms: 'sneezing, runny nose' }
        ];
    
        (allergyServiceInstance.listAllergys as sinon.SinonStub).returns(Result.ok<IAllergyDTO[]>(allergies));
    
        const ctrl = new AllergyController(allergyServiceInstance);
    
        await ctrl.listAllergies(<Request>req, <Response>res, <NextFunction>next);
    
        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, allergies);
    });
});