import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import AllergyService from '../../src/services/allergyService';
import AllergyController from '../../src/controllers/allergyController';
import { IAllergyDTO } from '../../src/dto/IAllergyDTO';
import { Allergy } from '../../src/domain/allergy';
import { AllergyMap } from '../../src/mappers/AllergyMap';
import IAllergyRepo from '../../src/services/IRepos/IAllergyRepo';
import { Result } from '../../src/core/logic/Result';

jest.mock('../../src/mappers/AllergyMap');
jest.mock('../../src/services/IRepos/IAllergyRepo');

describe('Allergy Service and Controller Integration Tests', () => {
  let allergyService: AllergyService;
  let allergyController: AllergyController;
  let mockAllergyRepo: jest.Mocked<IAllergyRepo>;
  let mockLogger: any;

  beforeAll(() => {
    mockAllergyRepo = {
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
    Container.set('allergyRepo', mockAllergyRepo);

    allergyService = new AllergyService(mockAllergyRepo, mockLogger);
    allergyController = new AllergyController(allergyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockAllergyDTO: IAllergyDTO = {
    id: '1',
    allergyCode: 'A001',
    allergyName: 'Peanut Allergy',
    allergyDescription: 'Allergy to peanuts',
    allergySymptoms: 'Hives, swelling, anaphylaxis',
  };

  const mockAllergy = Allergy.create(mockAllergyDTO).getValue();

  describe('createAllergy', () => {
    it('should create an allergy', async () => {
      const req = { body: mockAllergyDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.save.mockResolvedValue(mockAllergy);
      jest.spyOn(AllergyMap, 'toDTO').mockReturnValue(mockAllergyDTO);

      await allergyController.createAllergy(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAllergyDTO);
    });

    it('should handle errors during allergy creation', async () => {
      const req = { body: mockAllergyDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.save.mockRejectedValue(new Error('Error creating allergy'));

      await allergyController.createAllergy(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error creating allergy'));
    });
  });

  describe('updateAllergy', () => {
    it('should update an allergy', async () => {
      const req = { params: { id: '1' }, body: mockAllergyDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(mockAllergy);
      mockAllergyRepo.save.mockResolvedValue(mockAllergy);
      jest.spyOn(AllergyMap, 'toDTO').mockReturnValue(mockAllergyDTO);

      await allergyController.updateAllergy(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAllergyDTO);
    });

    it('should handle errors during allergy update', async () => {
      const req = { params: { id: '1' }, body: mockAllergyDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(mockAllergy);
      mockAllergyRepo.save.mockRejectedValue(new Error('Error updating allergy'));

      await allergyController.updateAllergy(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error updating allergy'));
    });

    it('should handle allergy not found during update', async () => {
      const req = { params: { id: '1' }, body: mockAllergyDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(null);

      await allergyController.updateAllergy(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Allergy not found');
    });
  });

  describe('deleteAllergy', () => {
    it('should delete an allergy', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(mockAllergy);
      mockAllergyRepo.delete.mockResolvedValue();

      await allergyController.deleteAllergy(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors during allergy deletion', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(mockAllergy);
      mockAllergyRepo.delete.mockRejectedValue(new Error('Error deleting allergy'));

      await allergyController.deleteAllergy(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('Error deleting allergy'));
    });

    it('should handle allergy not found during deletion', async () => {
      const req = { params: { id: '1' } } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findbydomainid.mockResolvedValue(null);

      await allergyController.deleteAllergy(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Allergy not found');
    });
  });

  describe('listAllergies', () => {
    it('should list all allergies', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findall.mockResolvedValue([mockAllergy]);
      jest.spyOn(AllergyMap, 'toDTO').mockReturnValue(mockAllergyDTO);

      await allergyController.listAllergies(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockAllergyDTO]);
    });

    it('should handle errors during listing allergies', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockAllergyRepo.findall.mockRejectedValue(new Error('An error occurred while fetching allergys.'));

      await allergyController.listAllergies(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('An error occurred while fetching allergys.'));
    });
  });
});