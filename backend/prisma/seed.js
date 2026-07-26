require('dotenv/config');
const { PrismaClient } = require('../generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('开始灌入种子数据...');

  // 创建测试用户
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'placeholder_hash_not_real',
      displayName: '测试用户',
      preferences: {
        create: {
          defaultScript: 'cyrillic',
          theme: 'light',
        },
      },
    },
  });
  console.log('已创建用户:', user.email);

  // 创建测试作品
  const bookWork = await prisma.bookWork.create({
    data: {
      title: '测试作品《阿拜箴言录》',
      author: '阿拜·库南巴耶夫',
      description: '这是一条用于开发测试的示例书籍数据',
      sourceType: 'user_import',
    },
  });
  console.log('已创建作品:', bookWork.title);

  // 创建该作品的西里尔文字版本
  const cyrillicVersion = await prisma.bookVersion.create({
    data: {
      bookWorkId: bookWork.id,
      scriptType: 'cyrillic',
      generationMethod: 'original_upload',
      contentRef: 'seed/cyrillic-placeholder',
      direction: 'ltr',
    },
  });
  console.log('已创建西里尔版本:', cyrillicVersion.id);

  // 创建一个测试章节
  await prisma.documentChapter.create({
    data: {
      bookVersionId: cyrillicVersion.id,
      chapterIndex: 1,
      title: '第一章：测试章节',
      content: '这里是测试用的章节正文内容。',
    },
  });
  console.log('已创建测试章节');

  console.log('种子数据灌入完成!');
}

main()
  .catch((e) => {
    console.error('种子脚本出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });