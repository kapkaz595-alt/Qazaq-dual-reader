const EPub = require('epub2').EPub;
const cheerio = require('cheerio'); // 用于从HTML提取纯文本

function parseEpubToNormalizedDocument(filePath, documentId) {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);

    epub.on('error', (err) => reject(err));

    epub.on('end', () => {
      const chapterPromises = epub.flow.map((chapterMeta, index) => {
        return new Promise((res, rej) => {
          epub.getChapter(chapterMeta.id, (err, text) => {
            if (err) return rej(err);

            const $ = cheerio.load(text);
            const paragraphs = [];
            $('p, h1, h2, h3').each((i, el) => {
              const tag = el.tagName.toLowerCase();
              const content = $(el).text().trim();
              if (content.length > 0) {
                paragraphs.push({
                  type: tag.startsWith('h') ? 'heading' : 'paragraph',
                  text: content
                });
              }
            });

            const chapterId = `ch${String(index + 1).padStart(3, '0')}`;
            const blocks = paragraphs.map((p, pIndex) => ({
              blockId: `${chapterId}-p${String(pIndex + 1).padStart(3, '0')}`,
              type: p.type,
              text: p.text,
              order: pIndex + 1
            }));

            res({
              chapterId,
              title: chapterMeta.title || null,
              order: index + 1,
              blocks
            });
          });
        });
      });

      Promise.all(chapterPromises)
        .then((chapters) => {
          const totalBlocks = chapters.reduce((sum, ch) => sum + ch.blocks.length, 0);
          resolve({
            documentId,
            format: 'epub',
            chapters,
            metadata: {
              sourceFile: filePath,
              parsedAt: new Date().toISOString(),
              totalBlocks
            }
          });
        })
        .catch(reject);
    });

    epub.parse();
  });
}

module.exports = { parseEpubToNormalizedDocument };