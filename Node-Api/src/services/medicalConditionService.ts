import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import IMedicalConditionService from './IServices/IMedicalConditionService';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { MedicalCondition } from '../domain/medicalCondition';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import config from '../../config';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
    constructor(
        @Inject(config.repos.medicalCondition.name) private medicalConditionRepo: IMedicalConditionRepo,
        @Inject('logger') private logger,
    ) { }


    public async createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
        try {
            this.logger.info('Creating medicalCondition with DTO:', medicalConditionDTO);

            const medicalConditionOrError = MedicalCondition.create({
                id: medicalConditionDTO.id,
                medicalConditionCode: medicalConditionDTO.medicalConditionCode,
                medicalConditionName: medicalConditionDTO.medicalConditionName,
                medicalConditionDescription: medicalConditionDTO.medicalConditionDescription,
                medicalConditionSymptoms: medicalConditionDTO.medicalConditionSymptoms
            });

            if (medicalConditionOrError.isFailure) {
                this.logger.error('Error creating MedicalCondition:', medicalConditionOrError.errorValue());
                return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
            }

            const medicalCondition = medicalConditionOrError.getValue();
            this.logger.info('Saving MedicalCondition', medicalCondition);
            await this.medicalConditionRepo.save(medicalCondition);

            const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition);
            this.logger.info('MedicalCondition created successfully:', medicalConditionDTOResult);
            return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);
        } catch (e) {
            this.logger.error('Error in createMedicalCondition', e);
            throw e;
        }
    }

    public async updateMedicalCondition(id: string, medicalConditionDTO: Partial<IMedicalConditionDTO>): Promise<Result<IMedicalConditionDTO>> {
        try {

            const medicalCondition = await this.medicalConditionRepo.findbydomainid(id);

            if (!medicalCondition) {
                return Result.fail<IMedicalConditionDTO>("MedicalCondition not found");
            }

            if (medicalConditionDTO.medicalConditionCode) {
                medicalCondition.props.medicalConditionCode = medicalConditionDTO.medicalConditionCode;
            }

            if (medicalConditionDTO.medicalConditionName) {
                medicalCondition.props.medicalConditionName = medicalConditionDTO.medicalConditionName;
            }

            if (medicalConditionDTO.medicalConditionDescription) {
                medicalCondition.props.medicalConditionDescription = medicalConditionDTO.medicalConditionDescription;
            }

            if (medicalConditionDTO.medicalConditionSymptoms) {
                medicalCondition.props.medicalConditionSymptoms = medicalConditionDTO.medicalConditionSymptoms;
            }

            await this.medicalConditionRepo.save(medicalCondition);

            const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition);

            return Result.ok<IMedicalConditionDTO>(medicalConditionDTOResult);

        } catch (e) {
            this.logger.error("Error updating medicalCondition:", e);
            throw e;
        }
    }

    public async removeMedicalCondition(id: string): Promise<Result<void>> {
        try {
            const medicalCondition = await this.medicalConditionRepo.findbydomainid(id);

            if (!medicalCondition) {
                return Result.fail<void>("MedicalCondition not found");
            }

            await this.medicalConditionRepo.delete(medicalCondition);
            return Result.ok<void>();
        } catch (e) {
            this.logger.error("Error removing medicalCondition:", e);
            throw e;
        }
    }

    public async listMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>> {
        try {
            const medicalConditions = await this.medicalConditionRepo.findall();
            const medicalConditionDTOs = medicalConditions.map(medicalCondition => MedicalConditionMap.toDTO(medicalCondition));
            return Result.ok<IMedicalConditionDTO[]>(medicalConditionDTOs);
        } catch (e) {
            this.logger.error('Error in listMedicalConditions', e);
            return Result.fail<IMedicalConditionDTO[]>('An error occurred while fetching medical conditions.');
        }
    }

}