import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { ISpecializationPersistence } from '../dataschema/ISpecializationPersistence';

import ISpecializationRepo from "../services/IRepos/ISpecializationRepo";
import { Specialization } from '../domain/specialization';
import { SpecializationId } from '../domain/specializationId';
import { SpecializationMap } from '../mappers/SpecializationMap';

@Service()
export default class SpecializationRepo implements ISpecializationRepo {
    private models: any;

    constructor(
        @Inject('specializationSchema') private specializationSchema: Model<ISpecializationPersistence & Document>,
        @Inject('logger') private logger
    ) { }
    


    public async exists(specialization: Specialization): Promise<boolean> {

        const idX = specialization.id instanceof SpecializationId ? (<SpecializationId>specialization.id).toValue() : specialization.id;
        const query = { domainId: idX };
        const specializationDocument = await this.specializationSchema.findOne(query as FilterQuery<ISpecializationPersistence & Document>);
        return !!specializationDocument === true;
    }

    public async save(specialization: Specialization): Promise<Specialization> {
        const query = { domainId: specialization.id.toString() };
        const specializationDocument = await this.specializationSchema.findOne(query);

        try {
            if (specializationDocument === null) {
                const rawSpecialization: any = SpecializationMap.toPersistence(specialization);
                this.logger.info('Creating new Specialization', rawSpecialization);

                const specializationCreated = await this.specializationSchema.create(rawSpecialization);

                return SpecializationMap.toDomain(specializationCreated);
            } else {
                specializationDocument.specializationType = specialization.specializationType;
                this.logger.info('Updating existing Specialization:', specializationDocument)

                await specializationDocument.save();
                return specialization;
            }
        } catch (err) {
            this.logger.error('Error saving Specialization', err);
            throw err;
        }
    }

    public async findbydomainid(specializationId: SpecializationId | string): Promise<Specialization> {
        const query = { domainId: specializationId };
        const specializationRecord = await this.specializationSchema.findOne(query as FilterQuery<ISpecializationPersistence & Document>);

        if (specializationRecord != null) {
            return SpecializationMap.toDomain(specializationRecord);
        } else {
            return null;
        }
    }


    public async delete(specialization: Specialization): Promise<void> {
        const query = { domainId: specialization.id.toString() };
        await this.specializationSchema.deleteOne(query as FilterQuery<ISpecializationPersistence & Document>);
    }

    
    public async findall(): Promise<Specialization[]> {
        const query = {};
        const specializationRecords = await this.specializationSchema.find(query as FilterQuery<ISpecializationPersistence & Document>);
        
        return specializationRecords.map(record => SpecializationMap.toDomain(record));
    }

    public async search(specialization: Specialization): Promise<Specialization[]> {
        const query = {
            domainId: specialization.id.toString(),
            specializationType: specialization.specializationType
        };
        const specializationRecords = await this.specializationSchema.find(query as FilterQuery<ISpecializationPersistence & Document>);
        
        return specializationRecords.map(record => SpecializationMap.toDomain(record));
    }
}
