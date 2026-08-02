const express = require('express');
const AppError = require('../utils/AppError');
const authenticate = require('../middlewares/authenticate');
const prisma = require('../config/prisma');
const { transliterateText: cyrillicToArabic } = require('../modules/conversion/cyrillicToArabic');
const { transliterateTextWithConfidence } = require('../modules/conversion/arabicToCyrillic');
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10分钟过期

function getCacheKey(text, sourceScript, targetScript) {
  return `${sourceScript}|${targetScript}|${text}`;
}

const router = express.Router();

const VALID_SCRIPTS = ['cyrillic', 'arabic'];

router.post('/text', async (req, res, next) => {
  try {
    const { text, sourceScript, targetScript } = req.body;

    if (typeof text !== 'string' || text.length === 0) {
      throw new AppError('text为必填项，且必须是非空字符串', 400);
    }

    if (!VALID_SCRIPTS.includes(sourceScript) || !VALID_SCRIPTS.includes(targetScript)) {
      throw new AppError('sourceScript和targetScript取值非法，允许值：cyrillic、arabic', 422);
    }

    if (sourceScript === targetScript) {
      throw new AppError('sourceScript和targetScript不能相同', 422);
    }

    const cacheKey = getCacheKey(text, sourceScript, targetScript);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({
        success: true,
        data: { ...cached.data, cached: true },
      });
    }

    let convertedText;
    let lowConfidenceSegments = [];

    if (sourceScript === 'cyrillic' && targetScript === 'arabic') {
      convertedText = cyrillicToArabic(text);
    } else {
      const result = transliterateTextWithConfidence(text);
      convertedText = result.text;
      lowConfidenceSegments = result.lowConfidenceSegments;
    }

    const responseData = {
      sourceScript,
      targetScript,
      originalText: text,
      convertedText,
      lowConfidenceSegments,
    };

    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    res.status(200).json({
      success: true,
      data: { ...responseData, cached: false },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/feedback', authenticate, async (req, res, next) => {
  try {
    const { bookVersionId, originalText, systemResult, suggestedResult } = req.body;

    if (!originalText || !systemResult || !suggestedResult) {
      throw new AppError('originalText、systemResult、suggestedResult均为必填项', 400);
    }

    const feedback = await prisma.conversionFeedback.create({
      data: {
        userId: req.user.id,
        bookVersionId: bookVersionId || null,
        originalText,
        systemResult,
        suggestedResult,
      },
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/task/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await prisma.conversionTask.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError('转换任务不存在', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: task.id,
        status: task.status,
        sourceBookVersionId: task.sourceBookVersionId,
        targetScriptType: task.targetScriptType,
        resultingBookVersionId: task.resultingBookVersionId,
        createdAt: task.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;