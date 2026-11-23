from pathlib import Path
import re
import zipfile
import pymupdf as fitz
from docx import Document

root = Path(__file__).resolve().parents[1]
pdf = fitz.open(root/'report/Lab7_Zhukov_variant1.pdf')
assert 'Ужгород-2026' in pdf[0].get_text()
assert pdf[1].get_text().startswith('1. Мета')
for i, page in enumerate(pdf):
    for block in page.get_text('blocks'):
        assert block[0] >= 40 and block[2] <= 560, (i+1, block)
doc = Document(root/'report/Lab7_Zhukov_variant1.docx')
assert len(doc.inline_shapes) == 3
assert len(doc.tables) == 7
for kind, count in [('Таблиця', 7), ('Рисунок', 3), ('Лістинг', 18)]:
    numbers = [int(re.match(kind+r' (\d+)', p.text)[1]) for p in doc.paragraphs
               if re.match(kind+r' \d+ -', p.text)]
    assert numbers == list(range(1, count+1)), (kind, numbers)
for p in doc.paragraphs:
    if p.runs and p.runs[0].font.name == 'Consolas':
        assert p.paragraph_format.keep_with_next
with zipfile.ZipFile(root/'report/Lab7_Zhukov_variant1.docx') as archive:
    assert not any(re.match(r'word/(header|footer)\d+.xml', n) for n in archive.namelist())
print('Verified layout bounds, title page, 7 tables, 3 images, 18 listings, captions, headers and footers.')
print('Pages:', len(pdf))
