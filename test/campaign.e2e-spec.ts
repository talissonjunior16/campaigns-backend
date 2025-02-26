import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from './../src/setup-app';

describe('Campaign E2E Test', () => {
  let app: INestApplication;
  let createdCampaignId: number;

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

  it('POST /campaigns should create a new campaign', async () => {
    const campaignData = {
      name: 'Test Campaign',
      startDate: '2025-06-01T00:00:00.000Z',
      endDate: '2025-06-30T23:59:59.000Z',
      categoryId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/campaigns')
      .send(campaignData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdCampaignId = response.body.id; // Save the created campaign ID
  });

  it('GET /campaigns should return a list of campaigns', async () => {
    const response = await request(app.getHttpServer()).get('/campaigns');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /campaigns/:id should return the created campaign', async () => {
    const response = await request(app.getHttpServer()).get(`/campaigns/${createdCampaignId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdCampaignId);
  });

  it('PUT /campaigns/:id should update the campaign', async () => {
    const updateData = {
      name: 'Updated Campaign',
      startDate: '2025-07-01T00:00:00.000Z',
      endDate: '2025-07-31T23:59:59.000Z',
      categoryId: 2,
    };

    const response = await request(app.getHttpServer())
      .put(`/campaigns/${createdCampaignId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateData.name);
  });

  it('DELETE /campaigns/:id should soft delete the campaign', async () => {
    const response = await request(app.getHttpServer()).delete(`/campaigns/${createdCampaignId}`);
    expect(response.status).toBe(200);
  });

  it('GET /campaigns/:id should return 404 for deleted campaign', async () => {
    const response = await request(app.getHttpServer()).get(`/campaigns/${createdCampaignId}`);
    expect(response.status).toBe(404);
  });
});
