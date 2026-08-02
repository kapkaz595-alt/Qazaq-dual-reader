const { transliterateText: cyrToArabic } = require('../../modules/conversion/cyrillicToArabic');
const { transliterateText: arabicToCyr } = require('../../modules/conversion/arabicToCyrillic');
const { CORPUS } = require('./transliterationCorpus');

let passCount = 0;
let failCount = 0;
let knownIssueCount = 0;
const failures = [];

CORPUS.forEach(({ cyrillic, category, known_issue }) => {
  const arabic = cyrToArabic(cyrillic);
  const backToCyrillic = arabicToCyr(arabic);
  const isMatch = cyrillic.toLowerCase() === backToCyrillic.toLowerCase();

  if (isMatch) {
    passCount += 1;
  } else if (known_issue) {
    knownIssueCount += 1;
  } else {
    failCount += 1;
    failures.push({ cyrillic, arabic, backToCyrillic, category });
  }
});

const total = CORPUS.length;
const effectiveTotal = total - knownIssueCount;
const passRate = ((passCount / effectiveTotal) * 100).toFixed(1);

console.log(`\n===== 转换引擎语料集测试报告 =====`);
console.log(`总语料数: ${total}`);
console.log(`已知局限(不计入基线): ${knownIssueCount}`);
console.log(`通过: ${passCount}`);
console.log(`失败: ${failCount}`);
console.log(`通过率(排除已知局限): ${passRate}%`);

if (failures.length > 0) {
  console.log(`\n----- 失败明细 -----`);
  failures.forEach(f => {
    console.log(`${f.cyrillic} -> ${f.arabic} -> ${f.backToCyrillic} (分类:${f.category})`);
  });
}
console.log(`===================================\n`);