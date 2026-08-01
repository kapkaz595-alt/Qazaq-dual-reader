const { CYRILLIC_TO_ARABIC_MAP, needsHamza } = require('./cyrillicToArabicMap');

const HAMZA = 'ٴ'; // U+0674 阿拉伯高海姆宰

/**
 * 将单个西里尔哈萨克语单词转写为阿拉伯哈萨克文
 * @param {string} cyrillicWord - 单个西里尔文单词（不含标点/空格）
 * @returns {string} 转写后的阿拉伯文单词
 */
function transliterateWord(cyrillicWord) {
  if (!cyrillicWord) return '';

  let result = '';

  for (const ch of cyrillicWord.toLowerCase()) {
    const mapped = CYRILLIC_TO_ARABIC_MAP[ch];
    // 映射表里没有的字符（标点、数字、非西里尔字符）原样保留
    result += mapped !== undefined ? mapped : ch;
  }

  if (needsHamza(cyrillicWord)) {
    result = HAMZA + result;
  }

  return result;
}

/**
 * 将一整段西里尔哈萨克文转写为阿拉伯哈萨克文
 * 按空格/标点切分单词，逐词转写，再拼接回原有的分隔符
 * @param {string} cyrillicText - 西里尔哈萨克语文本（可含多个单词、标点、换行）
 * @returns {string} 转写后的阿拉伯哈萨克文文本
 */
function transliterateText(cyrillicText) {
  if (!cyrillicText) return '';

  // 用捕获组切分，保留分隔符（空格、标点、换行等）以便原样拼回
  // 注意：ё不在а-я的连续Unicode范围内，必须单独列出，否则会被误判为分隔符
  const tokens = cyrillicText.split(/([^а-яёәғқңөұүһі]+)/i);

  return tokens
    .map(token => {
      // 判断token是否是"词"（含西里尔字母），还是分隔符/标点
      const isWord = /[а-яёәғқңөұүһі]/i.test(token);
      return isWord ? transliterateWord(token) : token;
    })
    .join('');
}

module.exports = {
  transliterateWord,
  transliterateText,
};