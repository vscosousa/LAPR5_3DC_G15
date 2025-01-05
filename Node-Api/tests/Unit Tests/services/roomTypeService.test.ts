import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import RoomTypeService from '../../../src/services/roomTypeService';
import IRoomTypeRepo from '../../../src/services/IRepos/IRoomTypeRepo';
import { IRoomTypeDTO } from '../../../src/dto/IRoomTypeDTO';
import { RoomType } from '../../../src/domain/roomType';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { RoomTypeMap } from '../../../src/mappers/RoomTypeMap';

describe('RoomTypeService', function () {
    let sandbox: sinon.SinonSandbox;
    let roomTypeRepo: sinon.SinonStubbedInstance<IRoomTypeRepo>;
    let logger: any;
    let roomTypeService: RoomTypeService;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        roomTypeRepo = {
            save: sandbox.stub(),
            findByDomainId: sandbox.stub(),
            findAll: sandbox.stub(),
        } as unknown as sinon.SinonStubbedInstance<IRoomTypeRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        roomTypeService = new RoomTypeService(logger, roomTypeRepo);

        // Mock UniqueEntityID generation
        sandbox.stub(UniqueEntityID.prototype, 'toString').returns('123');
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create a room type successfully', async function () {
        const typeName = 'Operating Room';
        const status: 'suitable' | 'unsuitable' = 'suitable';
        const roomTypeDTO: IRoomTypeDTO = { domainId: '123', typeName, status };

        const roomTypeOrError = RoomType.create({ typeName, status }, new UniqueEntityID(roomTypeDTO.domainId));
        expect(roomTypeOrError.isSuccess).to.be.true;
        const roomType = roomTypeOrError.getValue();

        roomTypeRepo.save.resolves();

        const result = await roomTypeService.createRoomType(typeName, status);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(roomTypeDTO);
        sinon.assert.calledOnce(roomTypeRepo.save);
        sinon.assert.calledWith(logger.info, 'Room type added:', sinon.match.instanceOf(RoomType));
    });

    it('should fail to create a room type with invalid properties', async function () {
        const typeName = '';
        const status: 'suitable' | 'unsuitable' = 'suitable';

        const result = await roomTypeService.createRoomType(typeName, status);

        expect(result.isFailure).to.be.true;
        sinon.assert.notCalled(roomTypeRepo.save);
        sinon.assert.calledWith(logger.error, 'Failed to add room type:', 'typeName is required');
    });

    it('should get all room types successfully', async function () {
        const roomTypes = [
            RoomType.create({ typeName: 'Operating Room', status: 'suitable' }, new UniqueEntityID('1')).getValue(),
            RoomType.create({ typeName: 'Emergency Room', status: 'suitable' }, new UniqueEntityID('2')).getValue()
        ];
        roomTypeRepo.findAll.resolves(roomTypes);

        const result = await roomTypeService.getRoomTypes();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(roomTypes.map(RoomTypeMap.toDTO));
        sinon.assert.calledOnce(roomTypeRepo.findAll);
    });
});