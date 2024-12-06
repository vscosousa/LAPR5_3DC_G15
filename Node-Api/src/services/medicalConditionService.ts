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
                medicalConditionName: medicalConditionDTO.medicalConditionName
            });

            if (medicalConditionOrError.isFailure) {
                this.logger.error('Error creating MedicalCondition:', medicalConditionOrError.errorValue());
                return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
            }

            const medicalCondition = medicalConditionOrError.getValue();
            this.logger.info('Saving MedicalCondition', medicalCondition);
            await this.medicalConditionRepo.save(medicalCondition);

            const medicalConditionDTOResult = MedicalConditionMap.toDTO(medicalCondition);
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

            if (medicalConditionDTO.medicalConditionName) {
                medicalCondition.props.medicalConditionName = medicalConditionDTO.medicalConditionName;
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
            // Retrieve all medicalConditions from the repository
            const medicalConditions = await this.medicalConditionRepo.findall();
    
            if (!medicalConditions || medicalConditions.length === 0) {
                return Result.fail<IMedicalConditionDTO[]>("No medicalConditions found.");
            }
    
            // Map the result to DTOs (data transfer objects) if needed
            const medicalConditionDTOs = medicalConditions.map(medicalCondition => MedicalConditionMap.toDTO(medicalCondition));
    
            return Result.ok<IMedicalConditionDTO[]>(medicalConditionDTOs);
        } catch (e) {
            this.logger.error("Error retrieving medicalConditions:", e);
            return Result.fail<IMedicalConditionDTO[]>("An error occurred while fetching medicalConditions.");
        }
    }

}