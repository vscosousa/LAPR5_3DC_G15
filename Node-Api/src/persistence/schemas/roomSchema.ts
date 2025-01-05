import mongoose from 'mongoose';
import { IRoomPersistence } from '../../dataschema/IRoomPersistense';

const RoomSchema = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true,
            required: true
        },
        roomNumber: {
            type: String,
            required: [true, 'Please enter Room Number'],
            unique: true
        },
        roomType: {
            type: String,
            required: [true, 'Please enter Room Type']
        }
    },
    { timestamps: true },
);

export default mongoose.model<IRoomPersistence & mongoose.Document>('Room', RoomSchema);