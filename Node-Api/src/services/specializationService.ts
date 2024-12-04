import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import ISpecializationService from './IServices/ISpecializationService';
import ISpecializationRepo from './IRepos/ISpecializationRepo';
import { Specialization } from '../domain/specialization';
import { SpecializationMap } from '../mappers/SpecializationMap';
import { ISpecializationDTO } from '../dto/ISpecializationDTO';
import config from '../../config';

@Service()
export default class SpecializationService implements ISpecializationService{
    constructor(
        @Inject(config.repos.specialization.name) private specializationRepo: ISpecializationRepo,
        @Inject('logger') private logger,
    ){}

    public async createSpecialization(specializationDTO: ISpecializationDTO): Promise<Result<ISpecializationDTO>> {
        try{
            this.logger.info('Creating specialization with DTO:', specializationDTO);

            const specializationOrError = Specialization.create({
                id: specializationDTO.id,
                specializationType: specializationDTO.specializationType
            });

            if(specializationOrError.isFailure){
                this.logger.error('Error creating Specialization:', specializationOrError.errorValue());
                return Result.fail<ISpecializationDTO>(specializationOrError.errorValue());
            }

            const specialization = specializationOrError.getValue();
            this.logger.info('Saving Specialization', specialization);
            await this.specializationRepo.save(specialization);

            const specializationDTOResult = SpecializationMap.toDTO(specialization);
            return Result.ok<ISpecializationDTO>(specializationDTOResult);
        }catch(e){
            this.logger.error('Error in createSpecialization', e);
            throw e;
        }
    }
}