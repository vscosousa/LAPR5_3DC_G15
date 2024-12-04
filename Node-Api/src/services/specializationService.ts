import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import ISpecializationService from './IServices/ISpecializationService';
import ISpecializationRepo from './IRepos/ISpecializationRepo';
import { Specialization } from '../domain/specialization';
import { SpecializationMap } from '../mappers/SpecializationMap';
import { ISpecializationDTO } from '../dto/ISpecializationDTO';
import config from '../../config';

@Service()
export default class SpecializationService implements ISpecializationService {
    constructor(
        @Inject(config.repos.specialization.name) private specializationRepo: ISpecializationRepo,
        @Inject('logger') private logger,
    ) { }


    public async createSpecialization(specializationDTO: ISpecializationDTO): Promise<Result<ISpecializationDTO>> {
        try {
            this.logger.info('Creating specialization with DTO:', specializationDTO);

            const specializationOrError = Specialization.create({
                id: specializationDTO.id,
                specializationType: specializationDTO.specializationType
            });

            if (specializationOrError.isFailure) {
                this.logger.error('Error creating Specialization:', specializationOrError.errorValue());
                return Result.fail<ISpecializationDTO>(specializationOrError.errorValue());
            }

            const specialization = specializationOrError.getValue();
            this.logger.info('Saving Specialization', specialization);
            await this.specializationRepo.save(specialization);

            const specializationDTOResult = SpecializationMap.toDTO(specialization);
            return Result.ok<ISpecializationDTO>(specializationDTOResult);
        } catch (e) {
            this.logger.error('Error in createSpecialization', e);
            throw e;
        }
    }

    public async updateSpecialization(id: string, specializationDTO: Partial<ISpecializationDTO>): Promise<Result<ISpecializationDTO>> {
        try {

            const specialization = await this.specializationRepo.findbydomainid(id);

            if (!specialization) {
                return Result.fail<ISpecializationDTO>("Specialization not found");
            }

            if (specializationDTO.specializationType) {
                specialization.props.specializationType = specializationDTO.specializationType;
            }

            await this.specializationRepo.save(specialization);

            const specializationDTOResult = SpecializationMap.toDTO(specialization);

            return Result.ok<ISpecializationDTO>(specializationDTOResult);

        } catch (e) {
            this.logger.error("Error updating specialization:", e);
            throw e;
        }
    }

    public async removeSpecialization(id: string): Promise<Result<void>> {
        try {
            const specialization = await this.specializationRepo.findbydomainid(id);
    
            if (!specialization) {
                return Result.fail<void>("Specialization not found");
            }
    
            await this.specializationRepo.delete(specialization);
            return Result.ok<void>();
        } catch (e) {
            this.logger.error("Error removing specialization:", e);
            throw e;
        }
    }

    public async listSpecializations(): Promise<Result<ISpecializationDTO[]>> {
        try {
            // Retrieve all specializations from the repository
            const specializations = await this.specializationRepo.findall();
    
            if (!specializations || specializations.length === 0) {
                return Result.fail<ISpecializationDTO[]>("No specializations found.");
            }
    
            // Map the result to DTOs (data transfer objects) if needed
            const specializationDTOs = specializations.map(specialization => SpecializationMap.toDTO(specialization));
    
            return Result.ok<ISpecializationDTO[]>(specializationDTOs);
        } catch (e) {
            this.logger.error("Error retrieving specializations:", e);
            return Result.fail<ISpecializationDTO[]>("An error occurred while fetching specializations.");
        }
    }

}