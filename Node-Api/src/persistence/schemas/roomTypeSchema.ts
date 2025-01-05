import mongoose from 'mongoose';
import { IRoomTypePersistence } from '../../dataschema/IRoomTypePersistence';

const RoomTypeSchema = new mongoose.Schema(
    {
    domainId: { type: String, required: true },
    typeName: { type: String, required: true },
    status: { type: String, required: true, enum: ['suitable', 'unsuitable'] },
    },
    { timestamps: true },
);

export default mongoose.model<IRoomTypePersistence & mongoose.Document>('RoomType', RoomTypeSchema);