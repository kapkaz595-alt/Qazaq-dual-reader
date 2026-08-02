// backend/modules/conversion/arabicToCyrillic.js
const { ARABIC_TO_CYRILLIC_MAP, MULTI_CHAR_SEQUENCES, HAMZA } = require('./arabicToCyrillicMap');
const { AMBIGUITY_DICTIONARY } = require('./ambiguityDictionary');
const { LOANWORD_DICTIONARY } = require('./loanwordDictionary');

// 已知一对多歧义的阿拉伯字符：ي(и/й) ه(э/һ) ش(ш/щ)
const AMBIGUOUS_ARABIC_CHARS = ['ي', 'ه', 'ش'];

function hasAmbiguousChar(word) {
  return AMBIGUOUS_ARABIC_CHARS.some(ch => word.includes(ch));
}

/**
 * 将单个阿拉伯哈萨克语单词转写为西里尔哈萨克文
 */
function transliterateWord(arabicWord) {
  // 优先查借词词典
  if (LOANWORD_DICTIONARY[arabicWord]) {
    return LOANWORD_DICTIONARY[arabicWord];
  }

  // 其次查歧义消解词典
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
 * 单词转写 + 置信度评估
 * 命中借词词典/歧义消解词典 -> high（词典已确认唯一正确写法）
 * 未命中且含歧义字符(ي/ه/ش) -> low（规则转写结果可能不唯一正确）
 * 未命中且不含歧义字符 -> high
 */
function transliterateWordWithConfidence(arabicWord) {
  if (LOANWORD_DICTIONARY[arabicWord] || AMBIGUITY_DICTIONARY[arabicWord] !== undefined) {
    return { text: transliterateWord(arabicWord), confidence: 'high' };
  }
  const text = transliterateWord(arabicWord);
  const confidence = hasAmbiguousChar(arabicWord) ? 'low' : 'high';
  return { text, confidence };
}

/**
 * 将一整段阿拉伯哈萨克文转写为西里尔哈萨克文
 */
function transliterateText(arabicText) {
  if (!arabicText) return '';

  const arabicLetterPattern = /[\u0600-\u06FF]/;
  const tokens = arabicText.split(/([^\u0600-\u06FF]+)/);

  return tokens
    .map(token => (arabicLetterPattern.test(token) ? transliterateWord(token) : token))
    .join('');
}

/**
 * 转写 + 返回低置信度片段列表
 * @returns {{ text: string, lowConfidenceSegments: Array<{original: string, converted: string}> }}
 */
function transliterateTextWithConfidence(arabicText) {
  if (!arabicText) return { text: '', lowConfidenceSegments: [] };

  const arabicLetterPattern = /[\u0600-\u06FF]/;
  const tokens = arabicText.split(/([^\u0600-\u06FF]+)/);

  let fullText = '';
  const lowConfidenceSegments = [];

  tokens.forEach(token => {
    if (arabicLetterPattern.test(token)) {
      const { text, confidence } = transliterateWordWithConfidence(token);
      fullText += text;
      if (confidence === 'low') {
        lowConfidenceSegments.push({ original: token, converted: text });
      }
    } else {
      fullText += token;
    }
  });

  return { text: fullText, lowConfidenceSegments };
}

module.exports = {
  transliterateWord,
  transliterateText,
  transliterateTextWithConfidence,
};