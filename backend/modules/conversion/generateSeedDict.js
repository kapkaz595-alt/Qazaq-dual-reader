const { transliterateWord } = require('./cyrillicToArabic');

const seedWords = ['әлем', 'бала', 'қазақ', 'кітап', 'ине', 'ащты'];

seedWords.forEach(word => {
  const arabic = transliterateWord(word);
  console.log(`'${arabic}': '${word}',`);
});