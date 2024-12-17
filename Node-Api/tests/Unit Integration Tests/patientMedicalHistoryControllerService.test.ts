import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import PatientMedicalHistoryService from '../../src/services/patientMedicalHistoryService';
import PatientMedicalHistoryController from '../../src/controllers/patientMedicalHistoryController';
import { IPatientMedicalHistoryDTO } from '../../src/dto/IPatientMedicalHistoryDTO';
import { PatientMedicalHistory } from '../../src/domain/patientMedicalHistory';
import { PatientMedicalHistoryMap } from '../../src/mappers/PatientMedicalHistoryMap';
import IPatientMedicalHistoryRepo from '../../src/services/IRepos/IPatientMedicalHistoryRepo';
import { Result } from '../../src/core/logic/Result';

jest.mock('../../src/mappers/PatientMedicalHistoryMap');
jest.mock('../../src/services/IRepos/IPatientMedicalHistoryRepo');

describe('Patient Medical History Service and Controller Integration Tests', () => {
  let patientMedicalHistoryService: PatientMedicalHistoryService;
  let patientMedicalHistoryController: PatientMedicalHistoryController;
  let mockPatientMedicalHistoryRepo: jest.Mocked<IPatientMedicalHistoryRepo>;
  let mockLogger: any;

  beforeAll(() => {
    mockPatientMedicalHistoryRepo = {
      save: jest.fn(),
      findByPatientMedicalRecordNumber: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    Container.set('logger', mockLogger);
    Container.set('patientMedicalHistoryRepo', mockPatientMedicalHistoryRepo);

    patientMedicalHistoryService = new PatientMedicalHistoryService(mockPatientMedicalHistoryRepo, mockLogger);
    patientMedicalHistoryController = new PatientMedicalHistoryController(patientMedicalHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPatientMedicalHistoryDTO: IPatientMedicalHistoryDTO = {
    id: '1',
    patientMedicalRecordNumber: 'MRN001',
    medicalConditions: ['Diabetes'],
    allergies: ['Peanuts'],
    familyHistory: ['Heart Disease'],
    freeText: 'Some additional information',
  };

  const mockPatientMedicalHistory = PatientMedicalHistory.create(mockPatientMedicalHistoryDTO).getValue();

  describe('createPatientMedicalHistory', () => {
    it('should create a patient medical history', async () => {
      const req = { body: mockPatientMedicalHistoryDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.save.mockResolvedValue(mockPatientMedicalHistory);
      jest.spyOn(PatientMedicalHistoryMap, 'toDTO').mockReturnValue(mockPatientMedicalHistoryDTO);

      await patientMedicalHistoryController.createPatientMedicalHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPatientMedicalHistoryDTO);
    });

    it('should handle errors during patient medical history creation', async () => {
      const req = { body: mockPatientMedicalHistoryDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.save.mockRejectedValue(new Error('Error creating patient medical history'));

      await patientMedicalHistoryController.createPatientMedicalHistory(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error creating patient medical history'));
    });
  });

  describe('updatePatientMedicalHistory', () => {
    it('should update a patient medical history', async () => {
      const req = { params: { patientMedicalRecordNumber: 'MRN001' }, body: mockPatientMedicalHistoryDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.findByPatientMedicalRecordNumber.mockResolvedValue(mockPatientMedicalHistory);
      mockPatientMedicalHistoryRepo.save.mockResolvedValue(mockPatientMedicalHistory);
      jest.spyOn(PatientMedicalHistoryMap, 'toDTO').mockReturnValue(mockPatientMedicalHistoryDTO);

      await patientMedicalHistoryController.updatePatientMedicalHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPatientMedicalHistoryDTO);
    });

    it('should handle errors during patient medical history update', async () => {
      const req = { params: { patientMedicalRecordNumber: 'MRN001' }, body: mockPatientMedicalHistoryDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.findByPatientMedicalRecordNumber.mockResolvedValue(mockPatientMedicalHistory);
      mockPatientMedicalHistoryRepo.save.mockRejectedValue(new Error('Error updating patient medical history'));

      await patientMedicalHistoryController.updatePatientMedicalHistory(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error updating patient medical history'));
    });

    it('should handle patient medical history not found during update', async () => {
      const req = { params: { patientMedicalRecordNumber: 'MRN001' }, body: mockPatientMedicalHistoryDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.findByPatientMedicalRecordNumber.mockResolvedValue(null);

      await patientMedicalHistoryController.updatePatientMedicalHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('PatientMedicalHistory not found');
    });
  });

  describe('getPatientMedicalHistory', () => {
    it('should get a patient medical history', async () => {
      const req = { params: { patientMedicalRecordNumber: 'MRN001' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.findByPatientMedicalRecordNumber.mockResolvedValue(mockPatientMedicalHistory);
      jest.spyOn(PatientMedicalHistoryMap, 'toDTO').mockReturnValue(mockPatientMedicalHistoryDTO);

      await patientMedicalHistoryController.getPatientMedicalHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPatientMedicalHistoryDTO);
    });

    it('should handle patient medical history not found', async () => {
      const req = { params: { patientMedicalRecordNumber: 'MRN001' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockPatientMedicalHistoryRepo.findByPatientMedicalRecordNumber.mockResolvedValue(null);

      await patientMedicalHistoryController.getPatientMedicalHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient medical history not found.' });
    });
  });
});