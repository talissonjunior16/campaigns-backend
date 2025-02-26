import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from './../src/setup-app';

describe('App E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should redirect to /docs', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.status).toBe(302);
    expect(response.header['location']).toBe('/docs');
  });

  it('GET /docs should load Swagger UI', async () => {
    const response = await request(app.getHttpServer()).get('/docs');
    expect(response.status).toBe(200);

    expect(response.text).toContain('<div id="swagger-ui">'); // Ensures Swagger UI is present
    expect(response.text).toContain('Swagger UI'); // Confirms Swagger loads properly
  });
});
