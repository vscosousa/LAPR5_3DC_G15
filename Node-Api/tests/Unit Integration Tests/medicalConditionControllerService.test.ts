import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import MedicalConditionService from '../../src/services/medicalConditionService';
import MedicalConditionController from '../../src/controllers/medicalConditionController';
import { IMedicalConditionDTO } from '../../src/dto/IMedicalConditionDTO';
import { MedicalCondition } from '../../src/domain/medicalCondition';
import { MedicalConditionMap } from '../../src/mappers/MedicalConditionMap';
import IMedicalConditionRepo from '../../src/services/IRepos/IMedicalConditionRepo';
import { Result } from '../../src/core/logic/Result';

jest.mock('../../src/mappers/MedicalConditionMap');
jest.mock('../../src/services/IRepos/IMedicalConditionRepo');

describe('Medical Condition Service and Controller Integration Tests', () => {
  let medicalConditionService: MedicalConditionService;
  let medicalConditionController: MedicalConditionController;
  let mockMedicalConditionRepo: jest.Mocked<IMedicalConditionRepo>;
  let mockLogger: any;

  beforeAll(() => {
    mockMedicalConditionRepo = {
      save: jest.fn(),
      findbydomainid: jest.fn(),
      findbycode: jest.fn(),
      delete: jest.fn(),
      findall: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    Container.set('logger', mockLogger);
    Container.set('medicalConditionRepo', mockMedicalConditionRepo);

    medicalConditionService = new MedicalConditionService(mockMedicalConditionRepo, mockLogger);
    medicalConditionController = new MedicalConditionController(medicalConditionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMedicalConditionDTO: IMedicalConditionDTO = {
    id: '1',
    medicalConditionCode: 'C001',
    medicalConditionName: 'Diabetes',
    medicalConditionDescription: 'Chronic condition that affects the way the body processes blood sugar.',
    medicalConditionSymptoms: 'Increased thirst, frequent urination, hunger, fatigue, and blurred vision.',
  };

  const mockMedicalCondition = MedicalCondition.create(mockMedicalConditionDTO).getValue();

  describe('createMedicalCondition', () => {
    it('should create a medical condition', async () => {
      const req = { body: mockMedicalConditionDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.save.mockResolvedValue(mockMedicalCondition);
      jest.spyOn(MedicalConditionMap, 'toDTO').mockReturnValue(mockMedicalConditionDTO);

      await medicalConditionController.createMedicalCondition(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMedicalConditionDTO);
    });

    it('should handle errors during medical condition creation', async () => {
      const req = { body: mockMedicalConditionDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.save.mockRejectedValue(new Error('Error creating medical condition'));

      await medicalConditionController.createMedicalCondition(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error creating medical condition'));
    });
  });

  describe('updateMedicalCondition', () => {
    it('should update a medical condition', async () => {
      const req = { params: { id: '1' }, body: mockMedicalConditionDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(mockMedicalCondition);
      mockMedicalConditionRepo.save.mockResolvedValue(mockMedicalCondition);
      jest.spyOn(MedicalConditionMap, 'toDTO').mockReturnValue(mockMedicalConditionDTO);

      await medicalConditionController.updateMedicalCondition(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMedicalConditionDTO);
    });

    it('should handle errors during medical condition update', async () => {
      const req = { params: { id: '1' }, body: mockMedicalConditionDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(mockMedicalCondition);
      mockMedicalConditionRepo.save.mockRejectedValue(new Error('Error updating medical condition'));

      await medicalConditionController.updateMedicalCondition(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error updating medical condition'));
    });

    it('should handle medical condition not found during update', async () => {
      const req = { params: { id: '1' }, body: mockMedicalConditionDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(null);

      await medicalConditionController.updateMedicalCondition(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('MedicalCondition not found');
    });
  });

  describe('deleteMedicalCondition', () => {
    it('should delete a medical condition', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(mockMedicalCondition);
      mockMedicalConditionRepo.delete.mockResolvedValue();

      await medicalConditionController.deleteMedicalCondition(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors during medical condition deletion', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(mockMedicalCondition);
      mockMedicalConditionRepo.delete.mockRejectedValue(new Error('Error deleting medical condition'));

      await medicalConditionController.deleteMedicalCondition(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error deleting medical condition'));
    });

    it('should handle medical condition not found during deletion', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findbydomainid.mockResolvedValue(null);

      await medicalConditionController.deleteMedicalCondition(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('MedicalCondition not found');
    });
  });

  describe('listMedicalConditions', () => {
    it('should list all medical conditions', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findall.mockResolvedValue([mockMedicalCondition]);
      jest.spyOn(MedicalConditionMap, 'toDTO').mockReturnValue(mockMedicalConditionDTO);

      await medicalConditionController.listMedicalConditions(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockMedicalConditionDTO]);
    });

    it('should handle errors during listing medical conditions', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockMedicalConditionRepo.findall.mockRejectedValue(new Error('An error occurred while fetching medical conditions.'));

      await medicalConditionController.listMedicalConditions(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('An error occurred while fetching medical conditions.'));
    });
  });
});