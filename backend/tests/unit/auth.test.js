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
    // 先注册一个专门用于登录测试的账号
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