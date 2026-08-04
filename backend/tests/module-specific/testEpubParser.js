const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { parseEpubToNormalizedDocument } = require('../../src/parsers/epubParser');

const testEpubPath = path.join(__dirname, 'sample.epub');

async function createSampleEpub() {
  const zip = new JSZip();

  zip.file('mimetype', 'application/epub+zip');

  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  zip.file(
    'OEBPS/content.opf',
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Test Book</dc:title>
    <dc:language>kk</dc:language>
    <dc:identifier id="BookId">test-book-001</dc:identifier>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter1"/>
  </spine>
</package>`
  );

  zip.file(
    'OEBPS/toc.ncx',
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head></head>
  <docTitle><text>Test Book</text></docTitle>
  <navMap>
    <navPoint id="navpoint-1">
      <navLabel><text>Chapter 1</text></navLabel>
      <content src="chapter1.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`
  );

  zip.file(
    'OEBPS/chapter1.xhtml',
    `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Chapter 1</title></head>
<body>
<h1>Бірінші тарау</h1>
<p>Бұл бірінші абзац.</p>
<p>Бұл екінші абзац.</p>
</body>
</html>`
  );

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(testEpubPath, content);
}

async function runTest() {
  await createSampleEpub();

  const result = await parseEpubToNormalizedDocument(testEpubPath, 'test-epub-001');
  console.log(JSON.stringify(result, null, 2));

  if (result.format !== 'epub') {
    console.error('FAIL: format字段不对');
    process.exit(1);
  }
  if (result.chapters.length !== 1) {
    console.error('FAIL: 章节数量不对，期望1，实际', result.chapters.length);
    process.exit(1);
  }
  if (result.chapters[0].blocks.length !== 3) {
    console.error('FAIL: block数量不对，期望3(1标题+2段落)，实际', result.chapters[0].blocks.length);
    process.exit(1);
  }

  console.log('PASS: EPUB解析测试通过');
  fs.unlinkSync(testEpubPath);
}

runTest().catch((err) => {
  console.error('测试出错:', err);
  process.exit(1);
});