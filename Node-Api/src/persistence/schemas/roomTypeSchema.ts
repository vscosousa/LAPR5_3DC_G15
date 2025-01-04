import mongoose from 'mongoose';
import { IRoomTypePersistence } from '../../dataschema/IRoomTypePersistence';

const RoomType = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },
        typeName: {
            type: String,
            required: [true, 'Please enter Room Type Name'],
            unique: true
        },
        description: {
            type: String,
            required: false
        }
    },
    { timestamps: true },
);

export default mongoose.model<IRoomTypePersistence & mongoose.Document>('RoomType', RoomType);