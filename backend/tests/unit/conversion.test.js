const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/prisma');

describe('POST /api/v1/convert/text', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('text缺失应返回400', async () => {
    const res = await request(app)
      .post('/api/v1/convert/text')
      .send({ sourceScript: 'cyrillic', targetScript: 'arabic' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('sourceScript取值非法应返回422', async () => {
    const res = await request(app)
      .post('/api/v1/convert/text')
      .send({ text: 'қазақ', sourceScript: 'latin', targetScript: 'arabic' });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('sourceScript与targetScript相同应返回422', async () => {
    const res = await request(app)
      .post('/api/v1/convert/text')
      .send({ text: 'қазақ', sourceScript: 'cyrillic', targetScript: 'cyrillic' });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('cyrillic转arabic应成功', async () => {
    const res = await request(app)
      .post('/api/v1/convert/text')
      .send({ text: `тест_${Date.now()}`, sourceScript: 'cyrillic', targetScript: 'arabic' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.convertedText).toBeDefined();
  });

  test('arabic转cyrillic应返回lowConfidenceSegments字段', async () => {
    const res = await request(app)
      .post('/api/v1/convert/text')
      .send({ text: 'قازاق', sourceScript: 'arabic', targetScript: 'cyrillic' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.lowConfidenceSegments)).toBe(true);
  });

  test('相同请求第二次应命中缓存', async () => {
    const payload = { text: `cache_test_${Date.now()}`, sourceScript: 'cyrillic', targetScript: 'arabic' };

    const firstRes = await request(app).post('/api/v1/convert/text').send(payload);
    const secondRes = await request(app).post('/api/v1/convert/text').send(payload);

    expect(firstRes.body.data.cached).toBe(false);
    expect(secondRes.body.data.cached).toBe(true);
  });

});

describe('POST /api/v1/convert/feedback', () => {

  const feedbackTestEmail = `feedback_${Date.now()}@example.com`;
  const feedbackTestPassword = 'abc12345';
  let validToken;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: feedbackTestEmail,
        password: feedbackTestPassword,
        displayName: '转换反馈测试用户'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: feedbackTestEmail, password: feedbackTestPassword });

    validToken = loginRes.body.data.token;
  });

  test('未携带令牌应返回401', async () => {
    const res = await request(app)
      .post('/api/v1/convert/feedback')
      .send({ originalText: 'test', systemResult: 'test', suggestedResult: 'test' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('缺少必填项应返回400', async () => {
    const res = await request(app)
      .post('/api/v1/convert/feedback')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ originalText: 'test' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('合法反馈应返回201及pending状态', async () => {
    const res = await request(app)
      .post('/api/v1/convert/feedback')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ originalText: 'test_original', systemResult: 'test_system', suggestedResult: 'test_suggested' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reviewStatus).toBe('pending');
  });

});

describe('GET /api/v1/convert/task/:id', () => {

  const taskTestEmail = `task_${Date.now()}@example.com`;
  const taskTestPassword = 'abc12345';
  let validToken;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: taskTestEmail,
        password: taskTestPassword,
        displayName: '任务状态测试用户'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: taskTestEmail, password: taskTestPassword });

    validToken = loginRes.body.data.token;
  });

  test('未携带令牌应返回401', async () => {
    const res = await request(app).get('/api/v1/convert/task/nonexistent-id');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('不存在的任务id应返回404', async () => {
    const res = await request(app)
      .get('/api/v1/convert/task/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

});