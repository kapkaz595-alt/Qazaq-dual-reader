const { transliterateText: cyrToArabic } = require('./modules/conversion/cyrillicToArabic');
const { transliterateText: arabicToCyr } = require('./modules/conversion/arabicToCyrillic');

const testWords = ['әлем', 'бала', 'қазақ', 'кітап'];

testWords.forEach(word => {
  const arabic = cyrToArabic(word);
  const backToCyrillic = arabicToCyr(arabic);
  console.log(`${word} -> ${arabic} -> ${backToCyrillic} | ${word === backToCyrillic ? '✓一致' : '✗不一致'}`);
});