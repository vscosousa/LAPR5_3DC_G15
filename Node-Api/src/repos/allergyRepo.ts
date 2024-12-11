import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';

import { Allergy } from '../domain/allergy';
import { AllergyId } from '../domain/allergyId';
import { AllergyMap } from '../mappers/AllergyMap';
import IAllergyRepo from '../services/IRepos/IAllergyRepo';

@Service()
export default class AllergyRepo implements IAllergyRepo {
    private models: any;

    constructor(
        @Inject('allergySchema') private allergySchema: Model<IAllergyPersistence & Document>,
        @Inject('logger') private logger
    ) { }


    public async exists(allergy: Allergy): Promise<boolean> {

        const idX = allergy.id instanceof AllergyId ? (<AllergyId>allergy.id).toValue() : allergy.id;
        const query = { domainId: idX };
        const allergyDocument = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);
        return !!allergyDocument === true;
    }

        public async save(allergy: Allergy): Promise<Allergy> {
        const query = { domainId: allergy.id.toString() };
        const allergyDocument = await this.allergySchema.findOne(query);
    
        try {
            if (allergyDocument === null) {
                const rawAllergy: any = AllergyMap.toPersistence(allergy);
                this.logger.info('Creating new Allergy', rawAllergy);
    
                const allergyCreated = await this.allergySchema.create(rawAllergy);
    
                return AllergyMap.toDomain(allergyCreated);
            } else {
                allergyDocument.allergyCode = allergy.allergyCode;
                allergyDocument.allergyName = allergy.allergyName;
                allergyDocument.allergyDescription = allergy.allergyDescription;
                allergyDocument.allergySymptoms = allergy.allergySymptoms;
                this.logger.info('Updating existing Allergy:', allergyDocument);
    
                await allergyDocument.save();
                return AllergyMap.toDomain(allergyDocument);
            }
        } catch (err) {
            this.logger.error('Error saving Allergy', err);
            throw err;
        }
    }

    public async findbydomainid(allergyId: AllergyId | string): Promise<Allergy> {
        const query = { domainId: allergyId };
        const allergyRecord = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);

        if (allergyRecord != null) {
            return AllergyMap.toDomain(allergyRecord);
        } else {
            return null;
        }
    }

    public async delete(allergy: Allergy): Promise<void> {
        const query = { domainId: allergy.id.toString() };
        await this.allergySchema.deleteOne(query as FilterQuery<IAllergyPersistence & Document>);
    }

    public async findall(): Promise<Allergy[]> {
        return await this.allergySchema.find();
    }

    public async findbycode(allergyCode: string): Promise<Allergy> {
        const query = { allergyCode: allergyCode };
        const allergyRecord = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);
        if (allergyRecord != null) {
            return AllergyMap.toDomain(allergyRecord);
        } else {
            return null;
        }
    }
}
