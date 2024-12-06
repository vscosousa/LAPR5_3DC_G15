import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';

import { MedicalCondition } from '../domain/medicalCondition';
import { MedicalConditionId } from '../domain/medicalConditionId';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import IMedicalConditionRepo from '../services/IRepos/IMedicalConditionRepo';

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
    private models: any;

    constructor(
        @Inject('medicalConditionSchema') private medicalConditionSchema: Model<IMedicalConditionPersistence & Document>,
        @Inject('logger') private logger
    ) { }


    public async exists(medicalCondition: MedicalCondition): Promise<boolean> {

        const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;
        const query = { domainId: idX };
        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
        return !!medicalConditionDocument === true;
    }

    public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition> {
        const query = { domainId: medicalCondition.id.toString() };
        const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);

        try {
            if (medicalConditionDocument === null) {
                const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);
                this.logger.info('Creating new MedicalCondition', rawMedicalCondition);

                const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

                return MedicalConditionMap.toDomain(medicalConditionCreated);
            } else {
                medicalConditionDocument.medicalConditionName = medicalCondition.medicalConditionName;
                this.logger.info('Updating existing MedicalCondition:', medicalConditionDocument)

                await medicalConditionDocument.save();
                return medicalCondition;
            }
        } catch (err) {
            this.logger.error('Error saving MedicalCondition', err);
            throw err;
        }
    }

    public async findbydomainid(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
        const query = { domainId: medicalConditionId };
        const medicalConditionRecord = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

        if (medicalConditionRecord != null) {
            return MedicalConditionMap.toDomain(medicalConditionRecord);
        } else {
            return null;
        }
    }

    public async delete(medicalCondition: MedicalCondition): Promise<void> {
        const query = { domainId: medicalCondition.id.toString() };
        await this.medicalConditionSchema.deleteOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
    }

    public async findall(): Promise<MedicalCondition[]> {
        return await this.medicalConditionSchema.find();
    }
}
