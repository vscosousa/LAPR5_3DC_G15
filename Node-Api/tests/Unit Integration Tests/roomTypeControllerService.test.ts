import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import RoomTypeService from '../../src/services/roomTypeService';
import RoomTypeController from '../../src/controllers/roomTypeController';
import { RoomType } from '../../src/domain/roomType';
import { RoomTypeMap } from '../../src/mappers/RoomTypeMap';
import IRoomTypeRepo from '../../src/services/IRepos/IRoomTypeRepo';
import { IRoomTypeDTO } from '../../src/dto/IRoomTypeDTO';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';
import { Result } from '../../src/core/logic/Result';

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
    id: '1',
    typeName: 'Operating Room',
  };

  const mockRoomType = RoomType.create({ typeName: mockRoomTypeDTO.typeName }, new UniqueEntityID(mockRoomTypeDTO.id)).getValue();

  describe('createRoomType', () => {
    it('should create a room type', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      jest.spyOn(roomTypeService, 'createRoomType').mockResolvedValue(Result.ok<IRoomTypeDTO>(mockRoomTypeDTO));

      await roomTypeController.createRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRoomTypeDTO);
    });

    it('should handle errors during room type creation', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      jest.spyOn(roomTypeService, 'createRoomType').mockResolvedValue(Result.fail('Error creating room type'));

      await roomTypeController.createRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error creating room type');
    });
  });

  describe('updateRoomType', () => {
    it('should update a room type', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      jest.spyOn(roomTypeService, 'updateRoomType').mockResolvedValue(Result.ok<IRoomTypeDTO>({
        id: mockRoomType.id.toString(),
        typeName: mockRoomType.typeName
      }));

      await roomTypeController.updateRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: mockRoomType.id.toString(),
        typeName: mockRoomType.typeName
      });
    });

    it('should handle errors during room type update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      jest.spyOn(roomTypeService, 'updateRoomType').mockResolvedValue(Result.fail('Error updating room type'));

      await roomTypeController.updateRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Error updating room type');
    });

    it('should handle room type not found during update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;
      const next = jest.fn() as NextFunction;

      jest.spyOn(roomTypeService, 'updateRoomType').mockResolvedValue(Result.fail('Room type not found'));

      await roomTypeController.updateRoomType(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Room type not found');
    });
  });
});