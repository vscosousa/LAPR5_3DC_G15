import 'reflect-metadata';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import AllergyService from '../../../src/services/allergyService';
import IAllergyRepo from '../../../src/services/IRepos/IAllergyRepo';
import { IAllergyDTO } from '../../../src/dto/IAllergyDTO';
import { Allergy } from '../../../src/domain/allergy';
import { AllergyMap } from '../../../src/mappers/AllergyMap';

describe('AllergyService', function () {
    let sandbox: sinon.SinonSandbox;
    let allergyRepo: sinon.SinonStubbedInstance<IAllergyRepo>;
    let logger: any;
    let allergyService: AllergyService;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        allergyRepo = {
            save: sandbox.stub(),
            findbydomainid: sandbox.stub(),
            delete: sandbox.stub(),
            findall: sandbox.stub()
        } as unknown as sinon.SinonStubbedInstance<IAllergyRepo>;

        logger = {
            info: sandbox.spy(),
            error: sandbox.spy(),
            warn: sandbox.spy()
        };

        allergyService = new AllergyService(allergyRepo, logger);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create an allergy successfully', async function () {
        const allergyDTO: IAllergyDTO = {
            id: '123',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };

        const allergy = Allergy.create(allergyDTO).getValue();
        allergyRepo.save.resolves();
        const allergyDTOResult = AllergyMap.toDTO(allergy);

        const result = await allergyService.createAllergy(allergyDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(allergyDTOResult);
        sinon.assert.calledOnce(allergyRepo.save);
        sinon.assert.calledWith(logger.info, 'Creating allergy with DTO:', allergyDTO);
    });

    it('should update an allergy successfully', async function () {
        const id = '123';
        const allergyDTO: Partial<IAllergyDTO> = {
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Severe peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        };

        const allergy = Allergy.create({
            id: '123',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        }).getValue();

        allergyRepo.findbydomainid.resolves(allergy);
        allergyRepo.save.resolves();
        const updatedAllergy = Allergy.create({
            id: '123',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Severe peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        }).getValue();
        const allergyDTOResult = AllergyMap.toDTO(updatedAllergy);

        const result = await allergyService.updateAllergy(id, allergyDTO);

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(allergyDTOResult);
        sinon.assert.calledOnce(allergyRepo.save);
        sinon.assert.calledWith(logger.info, 'Updating allergy with ID:', id);
    });

    it('should remove an allergy successfully', async function () {
        const id = '123';

        const allergy = Allergy.create({
            id: '123',
            allergyCode: 'A01',
            allergyName: 'Peanuts',
            allergyDescription: 'Peanut allergy',
            allergySymptoms: 'itchy skin, swelling, rash'
        }).getValue();

        allergyRepo.findbydomainid.resolves(allergy);
        allergyRepo.delete.resolves();

        const result = await allergyService.removeAllergy(id);

        expect(result.isSuccess).to.be.true;
        sinon.assert.calledOnce(allergyRepo.delete);
        sinon.assert.calledWith(logger.info, 'Removing allergy with ID:', id);
    });

    it('should list all allergies successfully', async function () {
        const allergies = [
            Allergy.create({
                id: '123',
                allergyCode: 'A01',
                allergyName: 'Peanuts',
                allergyDescription: 'Peanut allergy',
                allergySymptoms: 'itchy skin, swelling, rash'
            }).getValue(),
            Allergy.create({
                id: '124',
                allergyCode: 'B02',
                allergyName: 'Dust',
                allergyDescription: 'Dust allergy',
                allergySymptoms: 'sneezing, runny nose'
            }).getValue()
        ];

        allergyRepo.findall.resolves(allergies);
        const allergyDTOs = allergies.map(allergy => AllergyMap.toDTO(allergy));

        const result = await allergyService.listAllergys();

        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(allergyDTOs);
        sinon.assert.calledOnce(allergyRepo.findall);
    });
});