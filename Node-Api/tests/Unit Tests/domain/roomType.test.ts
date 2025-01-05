import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { RoomType } from '../../../src/domain/roomType';

describe('RoomType Domain', () => {
    it('should create a room type successfully', () => {
        const roomTypeProps = {
            typeName: 'Operating Room'
        };

        const result = RoomType.create(roomTypeProps);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(RoomType);
        expect(result.getValue().typeName).to.equal(roomTypeProps.typeName);
    });

    it('should fail to create a room type with missing properties', () => {
        const roomTypeProps = {
            typeName: ''
        };

        const result = RoomType.create(roomTypeProps);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get room type properties', () => {
        const roomTypeProps = {
            typeName: 'Operating Room'
        };

        const result = RoomType.create(roomTypeProps);
        const roomType = result.getValue();

        roomType.props.typeName = 'Updated Room';

        expect(roomType.typeName).to.equal('Updated Room');
    });

    it('should create a room type with a specific id', () => {
        const roomTypeProps = {
            typeName: 'Operating Room'
        };

        const id = new UniqueEntityID('1');
        const result = RoomType.create(roomTypeProps, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});