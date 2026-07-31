// backend/modules/conversion/arabicToCyrillic.js
const { ARABIC_TO_CYRILLIC_MAP, MULTI_CHAR_SEQUENCES, HAMZA } = require('./arabicToCyrillicMap');
const { AMBIGUITY_DICTIONARY } = require('./ambiguityDictionary');

/**
 * 将单个阿拉伯哈萨克语单词转写为西里尔哈萨克文
 */
function transliterateWord(arabicWord) {
  // 优先查词典：如果整词能在歧义消解词典里查到，直接用词典答案
  if (AMBIGUITY_DICTIONARY[arabicWord] !== undefined) {
    return AMBIGUITY_DICTIONARY[arabicWord];
  }
  if (!arabicWord) return '';

  let word = arabicWord;
  // 去掉词首海姆宰标记（不对应任何西里尔字符）
  if (word.startsWith(HAMZA)) {
    word = word.slice(HAMZA.length);
  }

  let result = '';
  let i = 0;
  while (i < word.length) {
    let matched = false;

    // 优先匹配多字符组合（比如 يۋ -> ю），避免被拆成单字母误判
    for (const seq of MULTI_CHAR_SEQUENCES) {
      if (word.startsWith(seq.arabic, i)) {
        result += seq.cyrillic;
        i += seq.arabic.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const ch = word[i];
      const mapped = ARABIC_TO_CYRILLIC_MAP[ch];
      result += mapped !== undefined ? mapped : ch;
      i += 1;
    }
  }

  return result;
}

/**
 * 将一整段阿拉伯哈萨克文转写为西里尔哈萨克文
 */
function transliterateText(arabicText) {
  if (!arabicText) return '';

  // 按"阿拉伯文字符范围 vs 其他字符（空格/标点/换行）"切分，分隔符原样保留
  const arabicLetterPattern = /[\u0600-\u06FF]/;
  const tokens = arabicText.split(/([^\u0600-\u06FF]+)/);

  return tokens
    .map(token => (arabicLetterPattern.test(token) ? transliterateWord(token) : token))
    .join('');
}

module.exports = {
  transliterateWord,
  transliterateText,
};