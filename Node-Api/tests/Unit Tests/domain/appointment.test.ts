import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { IAppointmentDTO } from '../../../src/dto/IAppoinmentDTO';
import { Appointment } from '../../../src/domain/appointment';
import { DateTime } from '../../../src/domain/dateTime';
import { AppointmentStatus } from '../../../src/domain/appointmentStatus';

describe('Appointment Domain', () => {
    it('should create an appointment successfully', () => {
        const appointmentDTO: IAppointmentDTO = {
            id: '1',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: new Date(),
            status: 'scheduled',
            team: ['Doctor A', 'Nurse B']
        };

        const result = Appointment.create(appointmentDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(Appointment);
        expect(result.getValue().requestId).to.equal(appointmentDTO.requestId);
        expect(result.getValue().roomId).to.equal(appointmentDTO.roomId);
        expect(result.getValue().dateTime.toString()).to.equal(appointmentDTO.dateTime.toISOString());
        expect(result.getValue().status.getValue()).to.equal(appointmentDTO.status);
        expect(result.getValue().team).to.deep.equal(appointmentDTO.team);
    });

    it('should fail to create an appointment with missing properties', () => {
        const appointmentDTO: Partial<IAppointmentDTO> = {
            requestId: 'REQ001',
            roomId: 'ROOM001'
        };

        const result = Appointment.create(appointmentDTO as IAppointmentDTO);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get appointment properties', () => {
        const fixedDate = new Date().toISOString();
        const appointmentDTO: IAppointmentDTO = {
            id: '1',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: new Date(),
            status: 'scheduled',
            team: ['Doctor A', 'Nurse B']
        };

        const result = Appointment.create(appointmentDTO);
        const appointment = result.getValue();

        appointment.roomId = 'ROOM002';
        appointment.dateTime = DateTime.create(fixedDate);        
        appointment.status = AppointmentStatus.create('completed');
        appointment.team = ['Doctor C', 'Nurse D'];

        expect(appointment.requestId).to.equal(appointmentDTO.requestId);
        expect(appointment.roomId).to.equal('ROOM002');
        expect(appointment.dateTime.toString()).to.equal(fixedDate);
        expect(appointment.status.getValue()).to.equal('completed'); // Call getValue() function
        expect(appointment.team).to.deep.equal(['Doctor C', 'Nurse D']);
    });

    it('should create an appointment with a specific id', () => {
        const appointmentDTO: IAppointmentDTO = {
            id: '1',
            requestId: 'REQ001',
            roomId: 'ROOM001',
            dateTime: new Date(),
            status: 'scheduled',
            team: ['Doctor A', 'Nurse B']
        };

        const id = new UniqueEntityID('1');
        const result = Appointment.create(appointmentDTO, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});