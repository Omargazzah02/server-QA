import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { User } from '../models/user-model.js';
import app, { server } from '../server.js';

dotenv.config();

describe('POST /login', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      username: 'exemple',
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('✅ Successful login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'correctPassword' });

    expect(response.statusCode).toBe(200);
  }, 10000);

  test('❌ Incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrongPassword' });

    expect(response.statusCode).toBe(401);
  }, 10000);

  test('❌ Unknown user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'unknown@example.com', password: 'anyPassword' });

    expect(response.statusCode).toBe(404);
  }, 10000);
});
