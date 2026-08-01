const { transliterateText: cyrToArabic } = require('./modules/conversion/cyrillicToArabic');
const { transliterateText: arabicToCyr } = require('./modules/conversion/arabicToCyrillic');
const { LOANWORD_DICTIONARY } = require('./modules/conversion/loanwordDictionary');

const testWords = ['әлем', 'бала', 'қазақ', 'кітап', 'ине', 'ащты','ай', 'ине ', 'һәм', 'борщ', 'площадь', 'ещё', 'экономика', 'электр', 'поэзия', 'экран'];

testWords.forEach(word => {
  const arabic = cyrToArabic(word);
  const backToCyrillic = arabicToCyr(arabic);
  console.log(`${word} -> ${arabic} -> ${backToCyrillic} | ${word === backToCyrillic ? '✓一致' : '✗不一致'}`);
});

const key = cyrToArabic('борщ');
console.log('KEY:', JSON.stringify(key));
console.log('KEY MATCHES DICTIONARY:', LOANWORD_DICTIONARY[key] !== undefined, '| 词典里的值:', LOANWORD_DICTIONARY[key]);
console.log('ещё的阿拉伯文:', JSON.stringify(cyrToArabic('ещё')));
console.log('ё正向转写:', JSON.stringify(cyrToArabic('ё')));
const forward = cyrToArabic('ё');
console.log('正向转写ё得到:', JSON.stringify(forward));
console.log('字符编码:', [...forward].map(c => c.codePointAt(0).toString(16)));

const { transliterateWord: arabicToCyrWord } = require('./modules/conversion/arabicToCyrillic');
console.log('反向转写结果:', JSON.stringify(arabicToCyrWord(forward)));