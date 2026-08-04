const fs = require('fs');

function parseTxtToNormalizedDocument(filePath, documentId) {
  const rawText = fs.readFileSync(filePath, 'utf-8');

  // 按一个或多个空行分段
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const blocks = paragraphs.map((text, index) => {
    const order = index + 1;
    return {
      blockId: `ch001-p${String(order).padStart(3, '0')}`,
      type: 'paragraph',
      text,
      order
    };
  });

  const normalizedDocument = {
    documentId,
    format: 'txt',
    chapters: [
      {
        chapterId: 'ch001',
        title: null,
        order: 1,
        blocks
      }
    ],
    metadata: {
      sourceFile: filePath,
      parsedAt: new Date().toISOString(),
      totalBlocks: blocks.length
    }
  };

  return normalizedDocument;
}

module.exports = { parseTxtToNormalizedDocument };