const fs = require('fs');
const path = require('path');
const { parseTxtToNormalizedDocument } = require('../../src/parsers/txtParser');

// 生成一个临时测试txt文件
const testFilePath = path.join(__dirname, 'sample.txt');
const sampleContent = `Бірінші абзац осында.

Екінші абзац осында.

Үшінші абзац.`;

fs.writeFileSync(testFilePath, sampleContent, 'utf-8');

const result = parseTxtToNormalizedDocument(testFilePath, 'test-doc-001');

console.log(JSON.stringify(result, null, 2));

// 简单断言
if (result.chapters[0].blocks.length !== 3) {
  console.error('FAIL: 段落数量不对，期望3，实际', result.chapters[0].blocks.length);
  process.exit(1);
}
if (result.format !== 'txt') {
  console.error('FAIL: format字段不对');
  process.exit(1);
}

console.log('PASS: TXT解析测试通过');
fs.unlinkSync(testFilePath); // 清理临时文件