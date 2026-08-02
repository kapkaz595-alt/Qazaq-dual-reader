const { transliterateText: cyrToArabic } = require('../../modules/conversion/cyrillicToArabic');
const { transliterateTextWithConfidence } = require('../../modules/conversion/arabicToCyrillic');

const SAMPLE_TEXT = 'Мен мектепке барамын. Бүгін ауа райы жақсы. Сен қалайсың? '.repeat(10);
const ITERATIONS = 1000;

function benchmark(label, fn) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i += 1) {
    fn();
  }
  const end = process.hrtime.bigint();
  const totalMs = Number(end - start) / 1e6;
  const avgMs = totalMs / ITERATIONS;
  console.log(`${label}: 总耗时${totalMs.toFixed(2)}ms / ${ITERATIONS}次 = 平均${avgMs.toFixed(4)}ms/次`);
  return avgMs;
}

console.log(`\n===== 转换引擎性能基准测试 =====`);
console.log(`测试文本长度: ${SAMPLE_TEXT.length}字符, 迭代次数: ${ITERATIONS}\n`);

const arabicText = cyrToArabic(SAMPLE_TEXT);

const cyrToArAvg = benchmark('西里尔→阿拉伯', () => cyrToArabic(SAMPLE_TEXT));
const arToCyrAvg = benchmark('阿拉伯→西里尔', () => transliterateTextWithConfidence(arabicText));

console.log(`\n----- 基线判定 -----`);
console.log(`约定基线: 单次转换 < 50ms`);
console.log(`西里尔→阿拉伯: ${cyrToArAvg < 50 ? '✓ 达标' : '✗ 未达标'}`);
console.log(`阿拉伯→西里尔: ${arToCyrAvg < 50 ? '✓ 达标' : '✗ 未达标'}`);
console.log(`=================================\n`);