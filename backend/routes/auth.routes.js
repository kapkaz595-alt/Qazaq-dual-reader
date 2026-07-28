const express = require('express');
const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
const prisma = require('../config/prisma');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

   if (!email || !password || !displayName) {
      throw new AppError('邮箱、密码、展示名均为必填项', 400);
    }

    const isPasswordStrongEnough = password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    if (!isPasswordStrongEnough) {
      throw new AppError('密码至少8位，且需同时包含字母和数字', 422);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('该邮箱已被注册', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('邮箱和密码均为必填项', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('邮箱或密码错误', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('邮箱或密码错误', 401);
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/preferences', authenticate, async (req, res, next) => {
  try {
    const { defaultScript, fontPreference, fontSize, theme } = req.body;

    const validScripts = ['cyrillic', 'arabic'];
    const validThemes = ['light', 'dark'];

    if (defaultScript !== undefined && !validScripts.includes(defaultScript)) {
      throw new AppError('defaultScript取值非法，允许值：cyrillic、arabic', 422);
    }

    if (theme !== undefined && !validThemes.includes(theme)) {
      throw new AppError('theme取值非法，允许值：light、dark', 422);
    }

    const dataToUpdate = {};
    if (defaultScript !== undefined) dataToUpdate.defaultScript = defaultScript;
    if (fontPreference !== undefined) dataToUpdate.fontPreference = fontPreference;
    if (fontSize !== undefined) dataToUpdate.fontSize = fontSize;
    if (theme !== undefined) dataToUpdate.theme = theme;

    const updated = await prisma.userPreferences.upsert({
      where: { userId: req.user.id },
      update: dataToUpdate,
      create: {
        userId: req.user.id,
        defaultScript: defaultScript || 'cyrillic',
        fontPreference: fontPreference || null,
        fontSize: fontSize || null,
        theme: theme || 'light',
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { message: '已退出登录，请清除本地令牌' },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;