// 转换引擎标准测试语料集
// 每条记录：西里尔原文 + 预期是否闭环一致（西里尔→阿拉伯→西里尔应还原）
// known_issue字段标注已知歧义，评审时不算作失败

const CORPUS = [
  // 常见基础词
  { cyrillic: 'қазақ', category: 'basic' },
  { cyrillic: 'бала', category: 'basic' },
  { cyrillic: 'кітап', category: 'basic' },
  { cyrillic: 'мектеп', category: 'basic' },
  { cyrillic: 'дәптер', category: 'basic' },
  { cyrillic: 'үй', category: 'basic' },
  { cyrillic: 'ана', category: 'basic' },
  { cyrillic: 'әке', category: 'basic' },
  { cyrillic: 'дос', category: 'basic' },
  { cyrillic: 'жол', category: 'basic' },

  // 元音和谐/特殊字母覆盖
  { cyrillic: 'өмір', category: 'vowel' },
  { cyrillic: 'ғылым', category: 'vowel' },
  { cyrillic: 'құрдас', category: 'vowel' },
  { cyrillic: 'үлкен', category: 'vowel' },
  { cyrillic: 'іні', category: 'vowel' },

  // 已知歧义字符测试（借词词典应命中，闭环应一致）
  { cyrillic: 'борщ', category: 'loanword' },
  { cyrillic: 'площадь', category: 'loanword' },
  { cyrillic: 'ещё', category: 'loanword' },
  { cyrillic: 'экономика', category: 'loanword' },
  { cyrillic: 'электр', category: 'loanword' },
  { cyrillic: 'поэзия', category: 'loanword' },
  { cyrillic: 'экран', category: 'loanword' },

  // 已知歧义词典覆盖（ambiguityDictionary.js里的词）
  { cyrillic: 'бала', category: 'ambiguity' },
  { cyrillic: 'қазақ', category: 'ambiguity' },
  { cyrillic: 'кітап', category: 'ambiguity' },
  { cyrillic: 'әлем', category: 'ambiguity' },
  { cyrillic: 'ине', category: 'ambiguity' },
  { cyrillic: 'ащты', category: 'ambiguity' },

  // 含и/й歧义但未入词典的词（预期闭环可能不一致，属已知局限）
  { cyrillic: 'ойын', category: 'known_issue', known_issue: 'и/й歧义未入词典' },
  { cyrillic: 'сайын', category: 'known_issue', known_issue: 'и/й歧义未入词典' },

  // 短句（测试分词与标点处理）
  { cyrillic: 'Мен мектепке барамын.', category: 'sentence' },
  { cyrillic: 'Бүгін ауа райы жақсы.', category: 'sentence' },
  { cyrillic: 'Сен қалайсың?', category: 'sentence' },
];

module.exports = { CORPUS };