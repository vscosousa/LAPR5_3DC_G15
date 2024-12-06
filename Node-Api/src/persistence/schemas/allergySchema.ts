import { IAllergyPersistence } from '../../dataschema/IAllergyPersistence';
import mongoose from 'mongoose';

const Allergy = new mongoose.Schema(
    {
        domainId:{
            type: String,
            unique: true
        },
        allergyName:{
            type: String,
            required: [true, 'Please enter Allergy Name'],
            unique: true
        }
    },
    { timestamps: true },
);

export default mongoose.model<IAllergyPersistence & mongoose.Document>('Allergy', Allergy);


