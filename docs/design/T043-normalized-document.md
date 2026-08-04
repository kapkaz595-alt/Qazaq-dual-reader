# NormalizedDocument 标准文档结构设计

## 用途
统一 TXT / EPUB / PDF 三种源格式解析后的中间数据结构，
作为 M2 转换引擎输入和 alignment_anchors 挂载基础。

## 结构定义

NormalizedDocument
├─ documentId: string        对应 book_versions.id
├─ format: "txt"|"epub"|"pdf"
├─ chapters: Chapter[]
└─ metadata: { sourceFile, parsedAt, totalBlocks }

Chapter
├─ chapterId: string         如 "ch001"
├─ title: string | null
├─ order: number
└─ blocks: Block[]

Block
├─ blockId: string           全局唯一，如 "ch001-p001"
├─ type: "paragraph"|"heading"|"quote"
├─ text: string              转换前原始文字
└─ order: number

## 关键决策
- TXT 无章节结构 → 整篇作为单章节（chapterId固定"ch001"）
- EPUB 按原生章节拆分
- PDF 尽量按标题/分页规则识别章节，识别不到则退化为单章节
- blockId 全局唯一，供 M2 转换结果与 alignment_anchors 表挂载