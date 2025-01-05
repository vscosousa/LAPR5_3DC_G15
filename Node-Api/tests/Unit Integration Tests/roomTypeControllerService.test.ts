import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import RoomTypeService from '../../src/services/roomTypeService';
import RoomTypeController from '../../src/controllers/roomTypeController';
import { RoomType } from '../../src/domain/roomType';
import { RoomTypeMap } from '../../src/mappers/RoomTypeMap';
import IRoomTypeRepo from '../../src/services/IRepos/IRoomTypeRepo';
import { IRoomTypeDTO } from '../../src/dto/IRoomTypeDTO';
import logger from '../../src/loaders/logger';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';

jest.mock('../../src/mappers/RoomTypeMap');
jest.mock('../../src/services/IRepos/IRoomTypeRepo');

describe('RoomType Service and Controller Integration Tests', () => {
  let roomTypeService: RoomTypeService;
  let roomTypeController: RoomTypeController;
  let mockRoomTypeRepo: jest.Mocked<IRoomTypeRepo>;
  let mockLogger: any;

  beforeAll(() => {
    mockRoomTypeRepo = {
      save: jest.fn(),
      findByDomainId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    Container.set('logger', mockLogger);
    Container.set('roomTypeRepo', mockRoomTypeRepo);

    roomTypeService = new RoomTypeService(mockLogger, mockRoomTypeRepo);
    roomTypeController = new RoomTypeController(roomTypeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRoomTypeDTO: IRoomTypeDTO = {
    domainId: '1',
    typeName: 'Operating Room',
    status: 'suitable'
  };

  const mockRoomType = RoomType.create({
    typeName: 'Operating Room',
    status: 'suitable'
  }, new UniqueEntityID('1')).getValue();

  describe('createRoomType', () => {
    it('should create a room type', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.save.mockResolvedValue(mockRoomType);
      jest.spyOn(RoomTypeMap, 'toDTO').mockReturnValue(mockRoomTypeDTO);

      await roomTypeController.createRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRoomTypeDTO);
    });

    it('should handle errors during room type creation', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.save.mockRejectedValue(new Error('Error creating room type'));

      await roomTypeController.createRoomType(req, res, next);


    });
  });

  describe('updateRoomType', () => {
    it('should update a room type', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.findByDomainId.mockResolvedValue(mockRoomType);
      mockRoomTypeRepo.save.mockResolvedValue(mockRoomType);
      jest.spyOn(RoomTypeMap, 'toDTO').mockReturnValue(mockRoomTypeDTO);

      await roomTypeController.updateRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRoomTypeDTO);
    });

    it('should handle errors during room type update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.findByDomainId.mockResolvedValue(mockRoomType);
      mockRoomTypeRepo.save.mockRejectedValue(new Error('Error updating room type'));

      await roomTypeController.updateRoomType(req, res, next);
    });

    it('should handle room type not found during update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as any as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.findByDomainId.mockResolvedValue(null);

      await roomTypeController.updateRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Room type not found');
    });
  });

  describe('getRoomTypes', () => {
    it('should get all room types', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.findAll.mockResolvedValue([mockRoomType]);
      jest.spyOn(RoomTypeMap, 'toDTO').mockReturnValue(mockRoomTypeDTO);

      await roomTypeController.getRoomTypes(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockRoomTypeDTO]);
    });

    it('should handle errors during fetching room types', async () => {
      const req = {} as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      mockRoomTypeRepo.findAll.mockRejectedValue(new Error('Error fetching room types'));

      await roomTypeController.getRoomTypes(req, res, next);

    });
  });
});