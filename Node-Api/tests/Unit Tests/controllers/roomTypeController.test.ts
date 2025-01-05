import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IRoomTypeService from '../../../src/services/IServices/IRoomTypeService';
import { IRoomTypeDTO } from '../../../src/dto/IRoomTypeDTO';
import RoomTypeController from '../../../src/controllers/roomTypeController';

describe('RoomTypeController', function () {
    let sandbox: sinon.SinonSandbox;
    let roomTypeServiceInstance: IRoomTypeService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        roomTypeServiceInstance = {
            createRoomType: sandbox.stub(),
            updateRoomType: sandbox.stub()
        } as unknown as IRoomTypeService;

        Container.set('IRoomTypeService', roomTypeServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createRoomType: returns json with id and typeName', async function () {
        const body = {
            typeName: 'Operating Room'
        };
        const req: Partial<Request> = { body };
        const res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        const next: Partial<NextFunction> = () => {};

        (roomTypeServiceInstance.createRoomType as sinon.SinonStub).returns(Result.ok<IRoomTypeDTO>({
            id: "1",
            typeName: req.body.typeName
        }));

        const ctrl = new RoomTypeController(roomTypeServiceInstance);

        await ctrl.createRoomType(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "1",
            typeName: req.body.typeName
        }));
    });

    it('updateRoomType: returns json with updated details', async function () {
        const body = {
            typeName: 'Updated Room'
        };
        const req: Partial<Request> = { body, params: { id: '1' } };
        const res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        const next: Partial<NextFunction> = () => {};

        (roomTypeServiceInstance.updateRoomType as sinon.SinonStub).returns(Result.ok<IRoomTypeDTO>({
            id: req.params.id,
            typeName: req.body.typeName
        }));

        const ctrl = new RoomTypeController(roomTypeServiceInstance);

        await ctrl.updateRoomType(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: req.params.id,
            typeName: req.body.typeName
        }));
    });
});