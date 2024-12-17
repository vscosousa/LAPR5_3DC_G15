import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import AppointmentService from '../../../src/services/appointmentService';
import IAppointmentRepo from '../../../src/services/IRepos/IAppointmentRepo';
import { IAppointmentDTO } from '../../../src/dto/IAppoinmentDTO';
import { Appointment } from '../../../src/domain/appointment';
import { AppointmentMap } from '../../../src/mappers/AppointmentMap';
import { DateTime } from '../../../src/domain/dateTime';
import { AppointmentStatus } from '../../../src/domain/appointmentStatus';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import https, { RequestOptions } from 'https';
import { IncomingMessage, ClientRequest } from 'http';

describe('AppointmentService', function () {
    let sandbox: sinon.SinonSandbox;
    let appointmentRepo: sinon.SinonStubbedInstance<IAppointmentRepo>;
    let logger: any;
    let appointmentService: AppointmentService;
    let httpsStub: sinon.SinonStub;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        appointmentRepo = {
            save: sandbox.stub(),
            findByDomainId: sandbox.stub(),
            findall: sandbox.stub(),
        } as unknown as sinon.SinonStubbedInstance<IAppointmentRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        appointmentService = new AppointmentService(appointmentRepo, logger);

        // Mock UniqueEntityID generation
        sandbox.stub(UniqueEntityID.prototype, 'toString').returns('123');

        // Mock HTTPS request
        httpsStub = sandbox.stub(https, 'request').callsFake((url: string | URL, options?: RequestOptions, callback?: (res: IncomingMessage) => void) => {
            if (typeof options === 'function') {
                callback = options;
                options = undefined;
            }
            const res = {
                statusCode: 200,
                on: (event: string, listener: (chunk?: any) => void) => {
                    if (event === 'data') {
                        listener('');
                    }
                    if (event === 'end') {
                        listener();
                    }
                }
            } as unknown as IncomingMessage;
            if (callback) {
                callback(res);
            }
            return {
                on: sandbox.stub(),
                write: sandbox.stub(),
                end: sandbox.stub(),
                aborted: false,
                host: '',
                protocol: '',
                reusedSocket: false,
                // Add other missing properties here
            } as unknown as ClientRequest;
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create an appointment successfully', async function () {
        const appointmentDTO: IAppointmentDTO = {
            id: '123',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: new Date(),
            status: 'scheduled',
            team: ['Doctor A', 'Nurse B']
        };

        const dateTimeOrError = DateTime.create(appointmentDTO.dateTime.toISOString());
        const statusOrError = AppointmentStatus.create(appointmentDTO.status);

        const appointment = Appointment.create({
            id: appointmentDTO.id,
            requestId: appointmentDTO.requestId,
            roomId: appointmentDTO.roomId,
            dateTime: dateTimeOrError.getValue(),
            status: statusOrError.getValue(),
            team: appointmentDTO.team
        }).getValue();

        appointmentRepo.save.resolves();
        const appointmentDTOResult = AppointmentMap.toDTO(appointment);

        const result = await appointmentService.createAppointment(appointmentDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(appointmentDTOResult);
        sinon.assert.calledOnce(appointmentRepo.save);
        sinon.assert.calledWith(logger.info, 'Creating appointment with DTO:', appointmentDTO);
    });

    it('should update an appointment successfully', async function () {
        const id = '123';
        const appointmentDTO: Partial<IAppointmentDTO> = {
            requestId: 'REQ002',
            roomId: 'ROOM002',
            dateTime: new Date(),
            status: 'completed',
            team: ['Doctor C', 'Nurse D']
        };

        const dateTimeOrError = DateTime.create(appointmentDTO.dateTime.toISOString());
        const statusOrError = AppointmentStatus.create(appointmentDTO.status);

        const appointment = Appointment.create({
            id: '123',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: dateTimeOrError.getValue(),
            status: statusOrError.getValue(),
            team: ['Doctor A', 'Nurse B']
        }).getValue();

        appointmentRepo.findByDomainId.resolves(appointment);
        appointmentRepo.save.resolves();
        const updatedAppointment = Appointment.create({
            id: '123',
            requestId: appointmentDTO.requestId,
            roomId: appointmentDTO.roomId,
            dateTime: dateTimeOrError.getValue(),
            status: statusOrError.getValue(),
            team: appointmentDTO.team
        }).getValue();
        const appointmentDTOResult = AppointmentMap.toDTO(updatedAppointment);

        const result = await appointmentService.updateAppointment(id, appointmentDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(appointmentDTOResult);
        sinon.assert.calledOnce(appointmentRepo.save);
    });

    it('should get all appointments successfully', async function () {
        const appointments = [
            Appointment.create({
                id: '123',
                requestId: 'REQ001',
                roomId: 'ROOM001',
                dateTime: DateTime.create(new Date().toISOString()).getValue(),
                status: AppointmentStatus.create('scheduled').getValue(),
                team: ['Doctor A', 'Nurse B']
            }).getValue(),
            Appointment.create({
                id: '124',
                requestId: 'REQ002',
                roomId: 'ROOM002',
                dateTime: DateTime.create(new Date().toISOString()).getValue(),
                status: AppointmentStatus.create('completed').getValue(),
                team: ['Doctor C', 'Nurse D']
            }).getValue()
        ];

        appointmentRepo.findall.resolves(appointments);
        const appointmentDTOs = appointments.map(appointment => AppointmentMap.toDTO(appointment));

        const result = await appointmentService.getAppointments();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(appointmentDTOs);
        sinon.assert.calledOnce(appointmentRepo.findall);
    });

    it('should get an appointment by ID successfully', async function () {
        const id = '123';

        const appointment = Appointment.create({
            id: '123',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: DateTime.create(new Date().toISOString()).getValue(),
            status: AppointmentStatus.create('scheduled').getValue(),
            team: ['Doctor A', 'Nurse B']
        }).getValue();

        appointmentRepo.findByDomainId.resolves(appointment);
        const appointmentDTOResult = AppointmentMap.toDTO(appointment);

        const result = await appointmentService.getAppointmentById(id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(appointmentDTOResult);
        sinon.assert.calledOnce(appointmentRepo.findByDomainId);
    });
});