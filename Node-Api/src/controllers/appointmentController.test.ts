import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../core/logic/Result';
import IAppointmentService from "../services/IServices/IAppointmentService";
import { IAppointmentDTO } from '../dto/IAppoinmentDTO';
import AppointmentController from './appointmentController';

describe('appointment controller', function () {
    let sandbox: sinon.SinonSandbox;
    let appointmentServiceInstance: IAppointmentService;

    beforeEach(function() {
        sandbox = sinon.createSandbox();
        appointmentServiceInstance = {
            createAppointment: sandbox.stub(),
            updateAppointment: sandbox.stub()
        } as unknown as IAppointmentService;

        Container.set('IAppointmentService', appointmentServiceInstance);
    });

    afterEach(function() {
        sandbox.restore();
        Container.reset();
    });

    it('createAppointment: returns json with id+details values', async function () {
        let body = {
            requestId: 'req123',
            roomId: 'room123',
            dateTime: new Date(),
            status: 'scheduled',
            team: ['teamMember1', 'teamMember2'] // Added team property
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (appointmentServiceInstance.createAppointment as sinon.SinonStub).returns(Result.ok<IAppointmentDTO>({
            id: "123",
            requestId: req.body.requestId,
            roomId: req.body.roomId,
            dateTime: req.body.dateTime,
            status: req.body.status,
            team: req.body.team // Added team property
        }));

        const ctrl = new AppointmentController(appointmentServiceInstance);

        await ctrl.createAppointment(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: "123",
            requestId: req.body.requestId,
            roomId: req.body.roomId,
            dateTime: req.body.dateTime,
            status: req.body.status,
            team: req.body.team // Added team property
        }));
    });

    it('updateAppointment: returns json with updated details', async function () {
        let body = {
            requestId: 'req123',
            roomId: 'room123',
            dateTime: new Date(),
            status: 'completed',
            team: ['teamMember1', 'teamMember2'] // Added team property
        };
        let req: Partial<Request> = {};
        req.body = body;
        req.params = { id: '123' };

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        let next: Partial<NextFunction> = () => {};

        (appointmentServiceInstance.updateAppointment as sinon.SinonStub).returns(Result.ok<IAppointmentDTO>({
            id: req.params.id,
            requestId: req.body.requestId,
            roomId: req.body.roomId,
            dateTime: req.body.dateTime,
            status: req.body.status,
            team: req.body.team // Added team property
        }));

        const ctrl = new AppointmentController(appointmentServiceInstance);

        await ctrl.updateAppointment(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status as sinon.SinonStub);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        sinon.assert.calledOnce(res.json as sinon.SinonSpy);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
            id: req.params.id,
            requestId: req.body.requestId,
            roomId: req.body.roomId,
            dateTime: req.body.dateTime,
            status: req.body.status,
            team: req.body.team // Added team property
        }));
    });
});