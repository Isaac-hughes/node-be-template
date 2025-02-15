const request = require('supertest');
const app = require('../../../src/app');

describe('Health Check API', () => {
  it('should return 200 for health check endpoint', async () => {
    const res = await request(app).get('/api/v1/health').send();

    expect(res.statusCode).toBe(200);
  });
});
