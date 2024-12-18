import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Schema, Document, Model } from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../../src/api/routes/appointmentRoute';
import { Container } from 'typedi';
import AppointmentController from '../../src/controllers/appointmentController';
import AppointmentService from '../../src/services/appointmentService';
import config from '../../config';
import AppointmentRepo from '../../src/repos/appointmentRepo';
import logger from '../../src/loaders/logger';
import nock from 'nock';

interface IAppointmentPersistence extends Document {
  domainId: string;
  requestId: string;
  roomId: string;
  dateTime: string;
  status: string;
  team: string[];
}

const AppointmentSchema: Schema = new Schema({
  domainId: { type: String, required: true },
  requestId: { type: String, required: true },
  roomId: { type: String, required: true },
  dateTime: { type: String, required: true },
  status: { type: String, required: true },
  team: { type: [String], required: true },
});

const AppointmentModel: Model<IAppointmentPersistence> = mongoose.model<IAppointmentPersistence>('Appointment', AppointmentSchema);

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const appointmentRepo = new AppointmentRepo(AppointmentModel, logger);
  const appointmentServiceInstance = new AppointmentService(appointmentRepo, logger);
  const appointmentControllerInstance = new AppointmentController(appointmentServiceInstance);

  Container.set('logger', logger);
  Container.set(config.repos.appointment.name, appointmentRepo);
  Container.set(config.services.appointment.name, appointmentServiceInstance);
  Container.set(config.controllers.appointment.name, appointmentControllerInstance);

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
  nock.cleanAll();
});

test('POST /appointments/create should create a new appointment', async () => {
  nock('https://localhost:5001')
    .put('/api/OperationRequest/schedule/req123')
    .reply(200, {});

  const response = await request(app)
    .post('/appointments/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      requestId: 'req123',
      roomId: 'room1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['member1', 'member2'],
    });

  expect(response.status).toBe(201);
  expect(response.body.requestId).toBe('req123');
  expect(response.body.roomId).toBe('room1');
});

test('PUT /appointments/update/:id should update an existing appointment', async () => {
  nock('https://localhost:5001')
    .put('/api/OperationRequest/schedule/req123')
    .reply(200, {});

  await request(app)
    .post('/appointments/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      requestId: 'req123',
      roomId: 'room1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['member1', 'member2'],
    });

  const listResponse = await request(app)
    .get('/appointments')
    .set('Authorization', `Bearer ${token}`);

  console.log("listResponse.body", listResponse.body);
  const appointmentId = listResponse.body._value[0].id;

  const updateResponse = await request(app)
    .put(`/appointments/update/${appointmentId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      roomId: 'room2',
      dateTime: '2023-10-10T11:00:00',
      team: ['member3', 'member4'],
    });

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.roomId).toBe('room2');
  expect(updateResponse.body.team).toContain('member3');
  expect(updateResponse.body.team).toContain('member4');
});

test('GET /appointments/:id should get an appointment by id', async () => {
  nock('https://localhost:5001')
    .put('/api/OperationRequest/schedule/req123')
    .reply(200, {});

  await request(app)
    .post('/appointments/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      requestId: 'req123',
      roomId: 'room1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['member1', 'member2'],
    });

  const listResponse = await request(app)
    .get('/appointments')
    .set('Authorization', `Bearer ${token}`);

  console.log("listResponse.body", listResponse.body);
  const appointmentId = listResponse.body._value[0].id;

  const getResponse = await request(app)
    .get(`/appointments/${appointmentId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(getResponse.status).toBe(200);
  expect(getResponse.body.requestId).toBe('req123');
  expect(getResponse.body.roomId).toBe('room1');
  expect(getResponse.body.team).toContain('member1');
  expect(getResponse.body.team).toContain('member2');
});

test('GET /appointments should list all appointments', async () => {
  nock('https://localhost:5001')
    .put('/api/OperationRequest/schedule/req123')
    .reply(200, {});

  nock('https://localhost:5001')
    .put('/api/OperationRequest/schedule/req124')
    .reply(200, {});

  await request(app)
    .post('/appointments/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      requestId: 'req123',
      roomId: 'room1',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['member1', 'member2'],
    });

  await request(app)
    .post('/appointments/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      requestId: 'req124',
      roomId: 'room2',
      dateTime: '2023-10-10T10:00:00',
      status: 'scheduled',
      team: ['member3', 'member4'],
    });

  const response = await request(app)
    .get('/appointments')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.isSuccess).toBe(true);
  expect(Array.isArray(response.body._value)).toBe(true);
  expect(response.body._value.length).toBe(2);
});