// backend/modules/conversion/cyrillicToArabicMap.js

// 单字母映射：西里尔哈萨克字母 -> 阿拉伯哈萨克字母（Unicode基础码位）
// 依据：哈萨克语西里尔字母表官方对照 + 用户提供的教学图片
const CYRILLIC_TO_ARABIC_MAP = {
  'а': 'ا', 'ә': 'ٵ',
  'б': 'ب',
  'в': 'ۆ',
  'г': 'گ',
  'ғ': 'ع',
  'д': 'د',
  'е': 'ە',
  'ж': 'ج',
  'з': 'ز',
  'и': 'ي',
  'й': 'ي',        // 与 и 共用同一阿拉伯字母，需上下文区分（元音/半元音）
  'к': 'ك',
  'қ': 'ق',
  'л': 'ل',
  'м': 'م',
  'н': 'ن',
  'ң': 'ڭ',
  'о': 'و',
  'ө': 'ٶ',
  'п': 'پ',
  'р': 'ر',
  'с': 'س',
  'т': 'ت',
  'у': 'ۋ',
  'ұ': 'ۇ',
  'ү': 'ٷ',
  'ф': 'ف',
  'х': 'ح',
  'һ': 'ه',
  'ц': 'تس',        // 无独立字母，按发音拆成组合
  'ч': 'چ',
  'ш': 'ش',
  'щ': 'ش',         // 哈萨克语本土词无此音，借词按ш处理
  'ъ': '',          // 硬标志：不发音，转写时忽略
  'ы': 'ى',
  'і': 'ٸ',
  'ь': '',          // 软标志：不发音，转写时忽略
  'э': 'ه',
  'ю': 'يۋ',        // 双元音拆分：й+у
  'я': 'يا',        // 双元音拆分：й+а
  'ё': 'يو',        // 双元音拆分：й+о
};

// 前元音字母（西里尔）：这些字母出现在词中，说明整个词是"前元音词"
const FRONT_VOWELS = new Set(['ә', 'е', 'і', 'ө', 'ү', 'э']);

// 后元音字母（西里尔）
const BACK_VOWELS = new Set(['а', 'ы', 'о', 'ұ']);

// 这几个辅音/元音出现时，本身就能确定前后元音归属，无需再加海姆宰标记
const HAMZA_SKIP_LETTERS = new Set(['к', 'г', 'қ', 'ғ', 'е', 'э']);

/**
 * 判断一个西里尔哈萨克语单词属于"前元音词"还是"后元音词"
 */
function getVowelHarmonyClass(cyrillicWord) {
  for (const ch of cyrillicWord.toLowerCase()) {
    if (FRONT_VOWELS.has(ch)) return 'front';
    if (BACK_VOWELS.has(ch)) return 'back';
  }
  return null;
}

/**
 * 判断该词是否需要在词首添加海姆宰标记
 */
function needsHamza(cyrillicWord) {
  const harmonyClass = getVowelHarmonyClass(cyrillicWord);
  if (harmonyClass !== 'front') return false;

  const hasDisambiguatingLetter = [...cyrillicWord.toLowerCase()]
    .some(ch => HAMZA_SKIP_LETTERS.has(ch));

  return !hasDisambiguatingLetter;
}

module.exports = {
  CYRILLIC_TO_ARABIC_MAP,
  needsHamza,
};