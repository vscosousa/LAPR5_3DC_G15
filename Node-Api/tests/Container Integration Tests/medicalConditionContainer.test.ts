import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Schema, Document, Model } from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../../src/api/routes/medicalConditionRoute';
import { Container } from 'typedi';
import MedicalConditionController from '../../src/controllers/medicalConditionController';
import MedicalConditionService from '../../src/services/medicalConditionService';
import config from '../../config';
import MedicalConditionRepo from '../../src/repos/medicalConditionRepo';
import logger from '../../src/loaders/logger';

interface IMedicalConditionPersistence extends Document {
  domainId: string;
  medicalConditionCode: string;
  medicalConditionName: string;
  medicalConditionDescription: string;
  medicalConditionSymptoms: string;
}

const MedicalConditionSchema: Schema = new Schema({
  domainId: { type: String, required: true },
  medicalConditionCode: { type: String, required: true },
  medicalConditionName: { type: String, required: true },
  medicalConditionDescription: { type: String, required: true },
  medicalConditionSymptoms: { type: String, required: true },
});

const MedicalConditionModel: Model<IMedicalConditionPersistence> = mongoose.model<IMedicalConditionPersistence>('MedicalCondition', MedicalConditionSchema);

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const medicalConditionRepo = new MedicalConditionRepo(MedicalConditionModel, logger);
  const medicalConditionServiceInstance = new MedicalConditionService(medicalConditionRepo, logger);
  const medicalConditionControllerInstance = new MedicalConditionController(medicalConditionServiceInstance);

  Container.set('logger', logger);
  Container.set(config.repos.medicalCondition.name, medicalConditionRepo);
  Container.set(config.services.medicalCondition.name, medicalConditionServiceInstance);
  Container.set(config.controllers.medicalCondition.name, medicalConditionControllerInstance);

  app = express();
  app.use(bodyParser.json());
  routes(app);

  token = jwt.sign({ userId: 'testUser', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin' }, config.jwtSecret, { expiresIn: '1h' });
}, 50000);

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

test('POST /medicalConditions/create should create a new medical condition', async () => {
  const response = await request(app)
    .post('/medicalConditions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionCode: 'A01',
      medicalConditionName: 'Condition A',
      medicalConditionDescription: 'Description A',
      medicalConditionSymptoms: 'Symptoms A',
    });

  expect(response.status).toBe(201);
  expect(response.body.medicalConditionCode).toBe('A01');
  expect(response.body.medicalConditionName).toBe('Condition A');
});

test('PUT /medicalConditions/update/:id should update an existing medical condition', async () => {
  await request(app)
    .post('/medicalConditions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionCode: 'A01',
      medicalConditionName: 'Condition A',
      medicalConditionDescription: 'Description A',
      medicalConditionSymptoms: 'Symptoms A',
    });

  const listResponse = await request(app)
    .get('/medicalConditions')
    .set('Authorization', `Bearer ${token}`);

  const medicalConditionId = listResponse.body[0].id;

  const updateResponse = await request(app)
    .put(`/medicalConditions/update/${medicalConditionId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionName: 'Updated Condition A',
    });

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.medicalConditionName).toBe('Updated Condition A');
});

test('DELETE /medicalConditions/delete/:id should delete a medical condition', async () => {
  await request(app)
    .post('/medicalConditions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionCode: 'A01',
      medicalConditionName: 'Condition A',
      medicalConditionDescription: 'Description A',
      medicalConditionSymptoms: 'Symptoms A',
    });

  const listResponse = await request(app)
    .get('/medicalConditions')
    .set('Authorization', `Bearer ${token}`);

  const medicalConditionId = listResponse.body[0].id;

  const deleteResponse = await request(app)
    .delete(`/medicalConditions/delete/${medicalConditionId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(deleteResponse.status).toBe(200);
});

test('GET /medicalConditions should list all medical conditions', async () => {
  // Create a couple of medical conditions to list
  await request(app)
    .post('/medicalConditions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionCode: 'A01',
      medicalConditionName: 'Condition A',
      medicalConditionDescription: 'Description A',
      medicalConditionSymptoms: 'Symptoms A',
    });

  await request(app)
    .post('/medicalConditions/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      medicalConditionCode: 'A02',
      medicalConditionName: 'Condition B',
      medicalConditionDescription: 'Description B',
      medicalConditionSymptoms: 'Symptoms B',
    });

  const response = await request(app)
    .get('/medicalConditions')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBe(2);
});