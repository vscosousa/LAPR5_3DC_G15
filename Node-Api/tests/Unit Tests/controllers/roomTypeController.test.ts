import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import IRoomTypeService from '../../../src/services/IServices/IRoomTypeService';
import { IRoomTypeDTO } from '../../../src/dto/IRoomTypeDTO';
import RoomTypeController from '../../../src/controllers/roomTypeController';
import { RoomType } from '../../../src/domain/roomType';
import RoomTypeService from '../../../src/services/roomTypeService';
import RoomTypeRepo from '../../../src/repos/RoomTypeRepo';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import logger from '../../../src/loaders/logger';

const mockRoomTypeDTO: IRoomTypeDTO = {
  domainId: '1',
  typeName: 'Operating Room',
  status: 'suitable'
};

const mockRoomType = RoomType.create({
  typeName: 'Operating Room',
  status: 'suitable'
}, new UniqueEntityID('1')).getValue();

describe('RoomTypeController', () => {
  let sandbox: sinon.SinonSandbox;
  let roomTypeService: IRoomTypeService;
  let roomTypeController: RoomTypeController;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    roomTypeService = {
      createRoomType: sandbox.stub(),
      updateRoomType: sandbox.stub(),
      getRoomTypes: sandbox.stub(),
    } as unknown as IRoomTypeService;

    Container.set('IRoomTypeService', roomTypeService);
    roomTypeController = new RoomTypeController(roomTypeService);
  });

  afterEach(() => {
    sandbox.restore();
    Container.reset();
  });

  describe('createRoomType', () => {
    it('should create a room type', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() } as any as Response;
      const next = sinon.spy() as NextFunction;

      (roomTypeService.createRoomType as sinon.SinonStub).returns(Result.ok<IRoomTypeDTO>(mockRoomTypeDTO));

      await roomTypeController.createRoomType(req, res, next);

      sinon.assert.calledOnce(res.status as sinon.SinonStub);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      sinon.assert.calledOnce(res.json as sinon.SinonSpy);
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match(mockRoomTypeDTO));
    });

    it('should handle errors during room type creation', async () => {
      const req = { body: mockRoomTypeDTO } as Request;
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() } as any as Response;
      const next = sinon.spy() as NextFunction;

      (roomTypeService.createRoomType as sinon.SinonStub).returns(Result.fail('Error creating room type'));

      await roomTypeController.createRoomType(req, res, next);

      sinon.assert.calledOnce(res.status as sinon.SinonStub);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledOnce(res.send as sinon.SinonSpy);
      sinon.assert.calledWith(res.send as sinon.SinonSpy, 'Error creating room type');
    });
  });

  describe('updateRoomType', () => {
    it('should update a room type', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() } as any as Response;
      const next = sinon.spy() as NextFunction;

      (roomTypeService.updateRoomType as sinon.SinonStub).returns(Result.ok<IRoomTypeDTO>({
        domainId: mockRoomType.id.toString(),
        typeName: mockRoomType.typeName,
        status: mockRoomType.status
      }));

      await roomTypeController.updateRoomType(req, res, next);

      sinon.assert.calledOnce(res.status as sinon.SinonStub);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
      sinon.assert.calledOnce(res.json as sinon.SinonSpy);
      sinon.assert.calledWith(res.json as sinon.SinonSpy, sinon.match({
        domainId: mockRoomType.id.toString(),
        typeName: mockRoomType.typeName,
        status: mockRoomType.status
      }));
    });

    it('should handle errors during room type update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() } as any as Response;
      const next = sinon.spy() as NextFunction;

      (roomTypeService.updateRoomType as sinon.SinonStub).returns(Result.fail('Error updating room type'));

      await roomTypeController.updateRoomType(req, res, next);

      sinon.assert.calledOnce(res.status as sinon.SinonStub);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledOnce(res.send as sinon.SinonSpy);
      sinon.assert.calledWith(res.send as sinon.SinonSpy, 'Error updating room type');
    });

    it('should handle room type not found during update', async () => {
      const req = { params: { id: '1' }, body: mockRoomTypeDTO } as unknown as Request;
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() } as any as Response;
      const next = sinon.spy() as NextFunction;

      (roomTypeService.updateRoomType as sinon.SinonStub).returns(Result.fail('Room type not found'));

      await roomTypeController.updateRoomType(req, res, next);

      sinon.assert.calledOnce(res.status as sinon.SinonStub);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledOnce(res.send as sinon.SinonSpy);
      sinon.assert.calledWith(res.send as sinon.SinonSpy, 'Room type not found');
    });
  });
});