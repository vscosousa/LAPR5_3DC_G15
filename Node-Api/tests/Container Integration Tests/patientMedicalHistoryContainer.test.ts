import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Schema, Document, Model } from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../../src/api/routes/patientMedicalHistoryRoute';
import { Container } from 'typedi';
import PatientMedicalHistoryController from '../../src/controllers/patientMedicalHistoryController';
import PatientMedicalHistoryService from '../../src/services/patientMedicalHistoryService';
import config from '../../config';
import PatientMedicalHistoryRepo from '../../src/repos/patientMedicalHistoryRepo';
import logger from '../../src/loaders/logger';

interface IPatientMedicalHistoryPersistence extends Document {
  domainId: string;
  patientMedicalRecordNumber: string;
  medicalConditions: string[];
  allergies: string[];
  familyHistory: string[];
  freeText: string;
}

const PatientMedicalHistorySchema: Schema = new Schema({
  domainId: { type: String, required: true },
  patientMedicalRecordNumber: { type: String, required: true },
  medicalConditions: { type: [String], required: false },
  allergies: { type: [String], required: false },
  familyHistory: { type: [String], required: false },
  freeText: { type: String, required: false },
});

const PatientMedicalHistoryModel: Model<IPatientMedicalHistoryPersistence> = mongoose.model<IPatientMedicalHistoryPersistence>('PatientMedicalHistory', PatientMedicalHistorySchema);

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const patientMedicalHistoryRepo = new PatientMedicalHistoryRepo(PatientMedicalHistoryModel, logger);
  const patientMedicalHistoryServiceInstance = new PatientMedicalHistoryService(patientMedicalHistoryRepo, logger);
  const patientMedicalHistoryControllerInstance = new PatientMedicalHistoryController(patientMedicalHistoryServiceInstance);

  Container.set('logger', logger);
  Container.set(config.repos.patientMedicalHistory.name, patientMedicalHistoryRepo);
  Container.set(config.services.patientMedicalHistory.name, patientMedicalHistoryServiceInstance);
  Container.set(config.controllers.patientMedicalHistory.name, patientMedicalHistoryControllerInstance);

  app = express();
  app.use(bodyParser.json());
  routes(app);

  token = jwt.sign({ userId: 'testUser', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Doctor' }, config.jwtSecret, { expiresIn: '1h' });
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

test('POST /patientsMedicalHistory/create should create a new patient medical history', async () => {
  const response = await request(app)
    .post('/patientsMedicalHistory/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      patientMedicalRecordNumber: '12345',
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['History1'],
      freeText: 'Some notes',
    });

  expect(response.status).toBe(201);
  expect(response.body.patientMedicalRecordNumber).toBe('12345');
  expect(response.body.medicalConditions).toContain('Condition1');
  expect(response.body.allergies).toContain('Allergy1');
  expect(response.body.familyHistory).toContain('History1');
});

test('PUT /patientsMedicalHistory/update/:patientMedicalRecordNumber should update an existing patient medical history', async () => {
  await request(app)
    .post('/patientsMedicalHistory/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      patientMedicalRecordNumber: '12345',
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['History1'],
      freeText: 'Some notes',
    });

  const updateResponse = await request(app)
    .put('/patientsMedicalHistory/update/12345')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditions: ['Condition2'],
      allergies: ['Allergy2'],
      familyHistory: ['History2'],
      freeText: 'Updated notes',
    });

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.medicalConditions).toContain('Condition2');
  expect(updateResponse.body.allergies).toContain('Allergy2');
  expect(updateResponse.body.familyHistory).toContain('History2');
  expect(updateResponse.body.freeText).toBe('Updated notes');
});

test('GET /patientsMedicalHistory/get/:patientMedicalRecordNumber should get a patient medical history by record number', async () => {
  await request(app)
    .post('/patientsMedicalHistory/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      patientMedicalRecordNumber: '12345',
      medicalConditions: ['Condition1'],
      allergies: ['Allergy1'],
      familyHistory: ['History1'],
      freeText: 'Some notes',
    });

  const getResponse = await request(app)
    .get('/patientsMedicalHistory/get/12345')
    .set('Authorization', `Bearer ${token}`);

  expect(getResponse.status).toBe(200);
  expect(getResponse.body.patientMedicalRecordNumber).toBe('12345');
  expect(getResponse.body.medicalConditions).toContain('Condition1');
  expect(getResponse.body.allergies).toContain('Allergy1');
  expect(getResponse.body.familyHistory).toContain('History1');
  expect(getResponse.body.freeText).toBe('Some notes');
});