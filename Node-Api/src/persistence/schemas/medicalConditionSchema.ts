import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';
import mongoose from 'mongoose';

const MedicalCondition = new mongoose.Schema(
    {
        domainId:{
            type: String,
            unique: true
        },
        medicalConditionCode:{
            type: String,
            required: [true, 'Please enter MedicalCondition Code'],
            unique: true,
            index: true,
        },
        medicalConditionName:{
            type: String,
            required: [true, 'Please enter MedicalCondition Name'],
            unique: true,
            index: true,
        },
        medicalConditionDescription:{
            type: String,
            required: [true, 'Please enter MedicalCondition Description'],
            index: true,
        },
        medicalConditionSymptoms:{
            type: String,
            required: [true, 'Please enter MedicalCondition Symptoms'],
            index: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>('MedicalCondition', MedicalCondition);


