// 常见借词词典：解决阿拉伯→西里尔反向转写时的多对一歧义
// 用西里尔原词自动生成对应的阿拉伯文key，避免手动输入阿拉伯字符出错
const { transliterateText: cyrToArabic } = require('./cyrillicToArabic');

const CYRILLIC_LOANWORDS = [
  'борщ',
  'площадь',
  'ещё',
  'экономика',
  'электр',
  'поэзия',
  'экран',
];

const LOANWORD_DICTIONARY = {};
CYRILLIC_LOANWORDS.forEach(word => {
  LOANWORD_DICTIONARY[cyrToArabic(word)] = word;
});

module.exports = { LOANWORD_DICTIONARY };