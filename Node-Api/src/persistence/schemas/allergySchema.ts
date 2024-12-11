import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const Allergy = new mongoose.Schema(
    {
        domainId:{
            type: String,
            unique: true
        },
        allergyCode:{
            type: String,
            required: [true, 'Please enter Allergy Code'],
            unique: true,
            index: true,
        },
        allergyName:{
            type: String,
            required: [true, 'Please enter Allergy Name'],
            unique: true,
            index: true,
        },
        allergyDescription:{
            type: String,
            required: [true, 'Please enter Allergy Description'],
            index: true,
        },
        allergySymptoms:{
            type: String,
            required: [true, 'Please enter Allergy Symptoms'],
            index: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', Allergy);


