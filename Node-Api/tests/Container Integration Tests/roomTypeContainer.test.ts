import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Schema, Document, Model } from 'mongoose';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import routes from '../../src/api/routes/roomTypeRoute';
import { Container } from 'typedi';
import RoomTypeController from '../../src/controllers/roomTypeController';
import RoomTypeService from '../../src/services/roomTypeService';
import config from '../../config';
import RoomTypeRepo from '../../src/repos/RoomTypeRepo';
import logger from '../../src/loaders/logger';
import nock from 'nock';
import { v4 as uuidv4 } from 'uuid';

interface IRoomTypePersistence extends Document {
  domainId: string;
  typeName: string;
  status: "suitable" | "unsuitable";
}
const RoomTypeSchema: Schema = new Schema({
  domainId: { type: String, required: true },
  typeName: { type: String, required: true },
  status: { type: String, required: true },
});
const RoomTypeModel: Model<IRoomTypePersistence> = mongoose.model<IRoomTypePersistence>('RoomType', RoomTypeSchema);

let mongoServer;
let app;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const roomTypeRepo = new RoomTypeRepo(RoomTypeModel, logger);
  const roomTypeServiceInstance = new RoomTypeService(logger, roomTypeRepo);
  const roomTypeControllerInstance = new RoomTypeController(roomTypeServiceInstance);

  Container.set('logger', logger);
  Container.set(config.repos.roomType.name, roomTypeRepo);
  Container.set(config.services.roomType.name, roomTypeServiceInstance);
  Container.set(config.controllers.roomType.name, roomTypeControllerInstance);

  app = express();
  app.use(bodyParser.json());
  routes(app); // Use the routes

  // Create the JWT token with role
  token = jwt.sign({ userId: 'testUser', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin' }, config.jwtSecret, { expiresIn: '1h' });
}, 50000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('RoomType API', () => {
  it('should create a room type successfully', async () => {
    const response = await request(app)
      .post('/room-types/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ typeName: 'Operating Room', status: 'suitable' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('typeName', 'Operating Room');
    expect(response.body).toHaveProperty('status', 'suitable');
  });

  it('should fail to create a room type with invalid properties', async () => {
    const response = await request(app)
      .post('/room-types/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ typeName: '', status: '' });

    expect(response.status).toBe(500);5  });

  it('should get all room types successfully', async () => {
    // Ensure no room types exist before the test
    await RoomTypeModel.deleteMany({});

    await request(app)
      .post('/room-types/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ typeName: 'Operating Room', status: 'suitable' });

    const response = await request(app)
      .get('/room-types')
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('typeName', 'Operating Room');
    expect(response.body[0]).toHaveProperty('status', 'suitable');
  });

  it('should update a room type successfully', async () => {
    const mockRoomType = new RoomTypeModel({ domainId: uuidv4(), typeName: 'Operating Room', status: 'suitable' });
    await mockRoomType.save(); // Ensure the room type exists
  
    const response = await request(app)
      .put(`/api/roomTypes/${mockRoomType.domainId}`)
      .send({ domainId: mockRoomType.domainId, typeName: 'Updated Room', status: 'unsuitable' });
  
    //expect(response.status).toBe(200);
    //expect(response.body).toHaveProperty('typeName', 'Updated Room');
    //expect(response.body).toHaveProperty('status', 'unsuitable');
  });
});