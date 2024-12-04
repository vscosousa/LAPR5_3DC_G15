import { ISpecializationPersistence } from '../../dataschema/ISpecializationPersistence';
import mongoose from 'mongoose';

const Specialization = new mongoose.Schema(
    {
        domainId:{
            type: String,
            unique: true
        },
        specializationType:{
            type: String,
            required: [true, 'Please enter Specialization Type'],
            unique: true
        }
    },
    { timestamps: true },
);

export default mongoose.model<ISpecializationPersistence & mongoose.Document>('Specialization', Specialization);


