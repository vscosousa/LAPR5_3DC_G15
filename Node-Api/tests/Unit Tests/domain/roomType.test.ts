import { expect } from 'chai';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { RoomType } from '../../../src/domain/roomType';

describe('RoomType Domain', () => {
    it('should create a room type successfully', () => {
        const roomTypeProps: { typeName: string; status: 'suitable' | 'unsuitable' } = {
            typeName: 'Operating Room',
            status: 'suitable'
        };

        const result = RoomType.create(roomTypeProps);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.be.instanceOf(RoomType);
        expect(result.getValue().typeName).to.equal(roomTypeProps.typeName);
        expect(result.getValue().status).to.equal(roomTypeProps.status);
    });

    it('should fail to create a room type with missing properties', () => {
        const roomTypeProps: { typeName: string; status: 'suitable' | 'unsuitable' } = {
            typeName: '',
            status: 'suitable'
        };

        const result = RoomType.create(roomTypeProps);

        expect(result.isFailure).to.be.true;
    });

    it('should set and get room type properties', () => {
        const roomTypeProps: { typeName: string; status: 'suitable' | 'unsuitable' } = {
            typeName: 'Operating Room',
            status: 'suitable'
        };

        const result = RoomType.create(roomTypeProps);
        const roomType = result.getValue();

        roomType.props.typeName = 'Updated Room';
        roomType.props.status = 'unsuitable';

        expect(roomType.typeName).to.equal('Updated Room');
        expect(roomType.status).to.equal('unsuitable');
    });

    it('should create a room type with a specific id', () => {
        const roomTypeProps: { typeName: string; status: 'suitable' | 'unsuitable' } = {
            typeName: 'Operating Room',
            status: 'suitable'
        };

        const id = new UniqueEntityID('1');
        const result = RoomType.create(roomTypeProps, id);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().id.toValue()).to.equal('1');
    });
});