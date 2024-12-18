import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import AppointmentService from '../../src/services/appointmentService';
import AppointmentController from '../../src/controllers/appointmentController';
import { Appointment } from '../../src/domain/appointment';
import { AppointmentMap } from '../../src/mappers/AppointmentMap';
import IAppointmentRepo from '../../src/services/IRepos/IAppointmentRepo';
import { IAppointmentDTO } from '../../src/dto/IAppoinmentDTO';
import https from 'https';

jest.mock('../../src/mappers/AppointmentMap');
jest.mock('../../src/services/IRepos/IAppointmentRepo');
jest.mock('https');

describe('Appointment Service and Controller Integration Tests', () => {
  let appointmentService: AppointmentService;
  let appointmentController: AppointmentController;
  let mockAppointmentRepo: jest.Mocked<IAppointmentRepo>;
  let mockLogger: any;

  beforeAll(() => {
    mockAppointmentRepo = {
      save: jest.fn(),
      findByDomainId: jest.fn(),
      findall: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    Container.set('logger', mockLogger);
    Container.set('appointmentRepo', mockAppointmentRepo);

    appointmentService = new AppointmentService(mockAppointmentRepo, mockLogger);
    appointmentController = new AppointmentController(appointmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockAppointmentDTO: IAppointmentDTO = {
    id: '1',
    requestId: 'REQ001',
    roomId: 'ROOM001',
    dateTime: new Date(),
    status: 'scheduled',
    team: ['Doctor A', 'Nurse B'],
  };

  const mockAppointment = Appointment.create(mockAppointmentDTO).getValue();

  describe('createAppointment', () => {
    it('should create an appointment', async () => {
      const req = { body: mockAppointmentDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.save.mockResolvedValue(mockAppointment);
      jest.spyOn(AppointmentMap, 'toDTO').mockReturnValue(mockAppointmentDTO);

      const mockRequest = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'end') {
            callback();
          }
        }),
        write: jest.fn(),
        end: jest.fn(),
      };
      (https.request as jest.Mock).mockImplementation((options, callback) => {
        callback({
          statusCode: 200, on: jest.fn().mockImplementation((event, callback) => {
            if (event === 'data') {
              callback('');
            }
            if (event === 'end') {
              callback();
            }
          })
        });
        return mockRequest;
      });

      await appointmentController.createAppointment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAppointmentDTO);
    });

    it('should handle errors during appointment creation', async () => {
      const req = { body: mockAppointmentDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.save.mockRejectedValue(new Error('Error creating appointment'));

      await appointmentController.createAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error creating appointment'));
    });
  });

  describe('updateAppointment', () => {
    it('should update an appointment', async () => {
      const req = { params: { id: '1' }, body: mockAppointmentDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findByDomainId.mockResolvedValue(mockAppointment);
      mockAppointmentRepo.save.mockResolvedValue(mockAppointment);
      jest.spyOn(AppointmentMap, 'toDTO').mockReturnValue(mockAppointmentDTO);

      await appointmentController.updateAppointment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAppointmentDTO);
    });

    it('should handle errors during appointment update', async () => {
      const req = { params: { id: '1' }, body: mockAppointmentDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findByDomainId.mockResolvedValue(mockAppointment);
      mockAppointmentRepo.save.mockRejectedValue(new Error('Error updating appointment'));

      await appointmentController.updateAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error updating appointment'));
    });

    it('should handle appointment not found during update', async () => {
      const req = { params: { id: '1' }, body: mockAppointmentDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findByDomainId.mockResolvedValue(null);

      await appointmentController.updateAppointment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Appointment not found');
    });
  });

  describe('listAppointments', () => {
    it('should list all appointments', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findall.mockResolvedValue([mockAppointment]);
      jest.spyOn(AppointmentMap, 'toDTO').mockReturnValue(mockAppointmentDTO);

      await appointmentController.getAppointments(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _value: [mockAppointmentDTO],
        error: null,
        isFailure: false,
        isSuccess: true
      });
    });

    it('should handle errors during listing appointments', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findall.mockRejectedValue(new Error('An error occurred while fetching appointments.'));

      await appointmentController.getAppointments(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('An error occurred while fetching appointments.'));
    });
  });

  describe('getAppointmentById', () => {
    it('should get an appointment by id', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), locals: {} } as any as Response;
      const next = jest.fn() as NextFunction;

      const mockResult = {
        _value: mockAppointmentDTO,
        error: null,
        isFailure: false,
        isSuccess: true
      };

      mockAppointmentRepo.findByDomainId.mockResolvedValue(mockAppointment);
      jest.spyOn(AppointmentMap, 'toDTO').mockReturnValue(mockAppointmentDTO);

      await appointmentController.getAppointmentById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(res.locals.data).toEqual(mockResult);
    });

    it('should handle errors during fetching appointment by id', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAppointmentRepo.findByDomainId.mockRejectedValue(new Error('Error fetching appointment'));

      await appointmentController.getAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error fetching appointment'));
    });
  });
});