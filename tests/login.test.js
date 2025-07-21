import request from 'supertest';
import app from '../server.js';  // make sure to include the .js extension


describe('POST /login', () => {
  test('✅ Successful login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'correctPassword' });

    expect(response.statusCode).toBe(200);
  });

  test('❌ Incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrongPassword' });

    expect(response.statusCode).toBe(401); // or 403 depending on your backend
  });

  test('❌ Unknown user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'unknown@example.com', password: 'anyPassword' });

    expect(response.statusCode).toBe(404);
  });
});
