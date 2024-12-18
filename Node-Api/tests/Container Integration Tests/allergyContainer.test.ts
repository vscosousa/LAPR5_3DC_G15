import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Schema, Document, Model } from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../../src/api/routes/allergyRoute';
import { Container } from 'typedi';
import AllergyController from '../../src/controllers/allergyController';
import AllergyService from '../../src/services/allergyService';
import config from '../../config';
import AllergyRepo from '../../src/repos/allergyRepo';
import logger from '../../src/loaders/logger';

interface IAllergyPersistence extends Document {
  domainId: string;
  allergyCode: string;
  allergyName: string;
  allergyDescription: string;
  allergySymptoms: string;
}

const AllergySchema: Schema = new Schema({
  domainId: { type: String, required: true },
  allergyCode: { type: String, required: true },
  allergyName: { type: String, required: true },
  allergyDescription: { type: String, required: true },
  allergySymptoms: { type: String, required: true },
});

const AllergyModel: Model<IAllergyPersistence> = mongoose.model<IAllergyPersistence>('Allergy', AllergySchema);

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const allergyRepo = new AllergyRepo(AllergyModel, logger);
  const allergyServiceInstance = new AllergyService(allergyRepo, logger);
  const allergyControllerInstance = new AllergyController(allergyServiceInstance);

  Container.set('logger', logger);
  Container.set(config.repos.allergy.name, allergyRepo);
  Container.set(config.services.allergy.name, allergyServiceInstance);
  Container.set(config.controllers.allergy.name, allergyControllerInstance);

  app = express();
  app.use(bodyParser.json());
  routes(app);

  token = jwt.sign({ userId: 'testUser', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin' }, config.jwtSecret, { expiresIn: '1h' });
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

test('POST /allergies/create should create a new allergy', async () => {
  const response = await request(app)
    .post('/allergies/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyCode: 'A01',
      allergyName: 'Pollen Allergy',
      allergyDescription: 'Allergy to pollen',
      allergySymptoms: 'Sneezing, runny nose',
    });

  expect(response.status).toBe(201);
  expect(response.body.allergyCode).toBe('A01');
  expect(response.body.allergyName).toBe('Pollen Allergy');
});

test('PUT /allergies/update/:id should update an existing allergy', async () => {
  await request(app)
    .post('/allergies/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyCode: 'A01',
      allergyName: 'Pollen Allergy',
      allergyDescription: 'Allergy to pollen',
      allergySymptoms: 'Sneezing, runny nose',
    });

  const listResponse = await request(app)
    .get('/allergies')
    .set('Authorization', `Bearer ${token}`);

  const allergyId = listResponse.body[0].id;

  const updateResponse = await request(app)
    .put(`/allergies/update/${allergyId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyName: 'Updated Pollen Allergy',
    });

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.allergyName).toBe('Updated Pollen Allergy');
});

test('DELETE /allergies/delete/:id should delete an allergy', async () => {
  await request(app)
    .post('/allergies/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyCode: 'A01',
      allergyName: 'Pollen Allergy',
      allergyDescription: 'Allergy to pollen',
      allergySymptoms: 'Sneezing, runny nose',
    });

  const listResponse = await request(app)
    .get('/allergies')
    .set('Authorization', `Bearer ${token}`);

  const allergyId = listResponse.body[0].id;

  const deleteResponse = await request(app)
    .delete(`/allergies/delete/${allergyId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(deleteResponse.status).toBe(204);
});

test('GET /allergies should list all allergies', async () => {
  // Create a couple of allergies to list
  await request(app)
    .post('/allergies/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyCode: 'A01',
      allergyName: 'Pollen Allergy',
      allergyDescription: 'Allergy to pollen',
      allergySymptoms: 'Sneezing, runny nose',
    });

  await request(app)
    .post('/allergies/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      allergyCode: 'A02',
      allergyName: 'Dust Allergy',
      allergyDescription: 'Allergy to dust',
      allergySymptoms: 'Coughing, sneezing',
    });

  const response = await request(app)
    .get('/allergies')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBe(2);
});