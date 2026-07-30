const request = require('supertest');
const app = require('../../app');
const prisma = require('../../config/prisma');

describe('POST /api/v1/auth/register', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('缺少必填项应返回400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('弱密码应返回422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `weak_${Date.now()}@example.com`,
        password: '12345678',
        displayName: '弱密码测试'
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('合法信息应注册成功', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `strong_${Date.now()}@example.com`,
        password: 'abc12345',
        displayName: '正常注册测试'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toContain('strong_');
  });

});

describe('POST /api/v1/auth/login', () => {

  const loginTestEmail = `login_${Date.now()}@example.com`;
  const loginTestPassword = 'abc12345';

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: loginTestEmail,
        password: loginTestPassword,
        displayName: '登录测试用户'
      });
  });

  test('缺少邮箱或密码应返回400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: loginTestEmail });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('邮箱不存在应返回401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: `nonexistent_${Date.now()}@example.com`,
        password: 'whatever123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('密码错误应返回401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: loginTestEmail,
        password: 'wrongPassword123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('凭据正确应返回200及有效令牌', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: loginTestEmail,
        password: loginTestPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(loginTestEmail);
  });

});

describe('需要身份校验的接口（/me, /preferences, /logout）', () => {

  const authedTestEmail = `authed_${Date.now()}@example.com`;
  const authedTestPassword = 'abc12345';
  let validToken;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: authedTestEmail,
        password: authedTestPassword,
        displayName: '身份校验测试用户'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: authedTestEmail,
        password: authedTestPassword
      });

    validToken = loginRes.body.data.token;
  });

  describe('GET /api/v1/auth/me', () => {

    test('未携带令牌应返回401', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('携带无效令牌应返回401', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer this.is.not.a.valid.token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('携带有效令牌应返回用户信息', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(authedTestEmail);
    });

  });

  describe('PATCH /api/v1/auth/preferences', () => {

    test('未携带令牌应返回401', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/preferences')
        .send({ theme: 'dark' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('theme取值非法应返回422', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ theme: 'rainbow' });

      expect(res.statusCode).toBe(422);
      expect(res.body.success).toBe(false);
    });

    test('defaultScript取值非法应返回422', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ defaultScript: 'latin' });

      expect(res.statusCode).toBe(422);
      expect(res.body.success).toBe(false);
    });

    test('合法偏好更新应返回200', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/preferences')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ theme: 'dark', defaultScript: 'arabic' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.theme).toBe('dark');
      expect(res.body.data.defaultScript).toBe('arabic');
    });

  });

  describe('POST /api/v1/auth/logout', () => {

    test('未携带令牌应返回401', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('携带有效令牌应返回200', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

  });

});