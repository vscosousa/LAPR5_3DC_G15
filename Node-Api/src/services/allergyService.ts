import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";
import IAllergyService from './IServices/IAllergyService';
import IAllergyRepo from './IRepos/IAllergyRepo';
import { Allergy } from '../domain/allergy';
import { AllergyMap } from '../mappers/AllergyMap';
import { IAllergyDTO } from '../dto/IAllergyDTO';
import config from '../../config';

@Service()
export default class AllergyService implements IAllergyService {
    constructor(
        @Inject(config.repos.allergy.name) private allergyRepo: IAllergyRepo,
        @Inject('logger') private logger,
    ) { }


    public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
        try {
            this.logger.info('Creating allergy with DTO:', allergyDTO);

            const allergyOrError = Allergy.create({
                id: allergyDTO.id,
                allergyName: allergyDTO.allergyName
            });

            if (allergyOrError.isFailure) {
                this.logger.error('Error creating Allergy:', allergyOrError.errorValue());
                return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
            }

            const allergy = allergyOrError.getValue();
            this.logger.info('Saving Allergy', allergy);
            await this.allergyRepo.save(allergy);

            const allergyDTOResult = AllergyMap.toDTO(allergy);
            return Result.ok<IAllergyDTO>(allergyDTOResult);
        } catch (e) {
            this.logger.error('Error in createAllergy', e);
            throw e;
        }
    }

    public async updateAllergy(id: string, allergyDTO: Partial<IAllergyDTO>): Promise<Result<IAllergyDTO>> {
        try {

            const allergy = await this.allergyRepo.findbydomainid(id);

            if (!allergy) {
                return Result.fail<IAllergyDTO>("Allergy not found");
            }

            if (allergyDTO.allergyName) {
                allergy.props.allergyName = allergyDTO.allergyName;
            }

            await this.allergyRepo.save(allergy);

            const allergyDTOResult = AllergyMap.toDTO(allergy);

            return Result.ok<IAllergyDTO>(allergyDTOResult);

        } catch (e) {
            this.logger.error("Error updating allergy:", e);
            throw e;
        }
    }

    public async removeAllergy(id: string): Promise<Result<void>> {
        try {
            const allergy = await this.allergyRepo.findbydomainid(id);
    
            if (!allergy) {
                return Result.fail<void>("Allergy not found");
            }
    
            await this.allergyRepo.delete(allergy);
            return Result.ok<void>();
        } catch (e) {
            this.logger.error("Error removing allergy:", e);
            throw e;
        }
    }

    public async listAllergys(): Promise<Result<IAllergyDTO[]>> {
        try {
            // Retrieve all allergys from the repository
            const allergys = await this.allergyRepo.findall();
    
            if (!allergys || allergys.length === 0) {
                return Result.fail<IAllergyDTO[]>("No allergys found.");
            }
    
            // Map the result to DTOs (data transfer objects) if needed
            const allergyDTOs = allergys.map(allergy => AllergyMap.toDTO(allergy));
    
            return Result.ok<IAllergyDTO[]>(allergyDTOs);
        } catch (e) {
            this.logger.error("Error retrieving allergys:", e);
            return Result.fail<IAllergyDTO[]>("An error occurred while fetching allergys.");
        }
    }

}