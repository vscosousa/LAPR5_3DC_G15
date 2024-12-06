import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalCondition = new mongoose.Schema(
    {
        domainId:{
            type: String,
            unique: true
        },
        medicalConditionName:{
            type: String,
            required: [true, 'Please enter MedicalCondition Name'],
            unique: true
        }
    },
    { timestamps: true },
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalCondition);


