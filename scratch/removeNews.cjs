
const fs = require('fs');
let content = fs.readFileSync('src/routes/admin.tsx', 'utf8');

// 1. Remove NewsItem interface
content = content.replace(/export interface NewsItem \{[\s\S]*?\}/, '');

// 2. Remove Newspaper import
content = content.replace(/,\s*Newspaper/, '');

// 3. Remove 'news' from Tab type
content = content.replace(/ \| "news"/g, '');

// 4. Remove News Form States
content = content.replace(/\/\/ News Form States[\s\S]*?\/\/ Creation Form States/, '// Creation Form States');

// 5. Remove news Realtime subscription
const realtimeRegex = /\.on\(\s*"postgres_changes",\s*\{\s*event:\s*"\*",\s*schema:\s*"public",\s*table:\s*"news"\s*\},[\s\S]*?fetchDashboardData\(true\);\s*\/\/\s*Silent update in background!\s*\}\s*,?\s*\)/g;
content = content.replace(realtimeRegex, '');

// 6. Remove Fetch News block
const fetchNewsRegex = /\/\/ 7\. Fetch News[\s\S]*?\} catch \(e\) \{\s*console\.warn\("News table not loaded yet or empty\.", e\);\s*setNewsList\(\[\]\);\s*\}/g;
content = content.replace(fetchNewsRegex, '');

// 7. Remove News sidebar link
content = content.replace(/\{\s*id:\s*"news",\s*label:\s*"News Editor",\s*icon:\s*Newspaper,\s*badge:\s*newsList\.length\s*\},\s*/g, '');

// 8. Remove TAB VIEW: NEWS block
const tabViewRegex = /\{\/\*\s*-*\s*TAB VIEW: NEWS \(COMPANY NEWS & INSIGHTS\)\s*-*\s*\*\/\}\s*\{activeTab === "news" && \([\s\S]*?(?:\{\/\* \s*Maximized view for News Article|\<\/main\>)/g;
content = content.replace(tabViewRegex, function(match) {
  if (match.endsWith('</main>')) return '</main>';
  return '{/* Maximized view for News Article';
});

// 9. Remove Maximized view for News Article block
const maximizedRegex = /\{\/\* Maximized view for News Article \*\/\}\s*\{selectedNews && \([\s\S]*?\<\/div\>\s*\)\}/g;
content = content.replace(maximizedRegex, '');

// 10. Handlers
const createHandler = /const handleCreateNews = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*catch\s*\(err\)\s*\{\s*const error = err as Error;\s*toast\.error\(error\.message\);\s*\}\s*\};\s*/;
content = content.replace(createHandler, '');

const startEditHandler = /const startEditNews = \(item: NewsItem\) => \{[\s\S]*?\}\s*;\s*/;
content = content.replace(startEditHandler, '');

const cancelEditHandler = /const cancelEditNews = \(\) => \{[\s\S]*?\}\s*;\s*/;
content = content.replace(cancelEditHandler, '');

const updateHandler = /const handleUpdateNews = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*catch\s*\(err\)\s*\{\s*const error = err as Error;\s*toast\.error\(error\.message\);\s*\}\s*\};\s*/;
content = content.replace(updateHandler, '');

const deleteHandler = /const handleDeleteNews = async \(newsId: string, newsTitle: string\) => \{[\s\S]*?\}\s*catch\s*\(err\)\s*\{\s*const error = err as Error;\s*toast\.error\(error\.message\);\s*\}\s*\};\s*/;
content = content.replace(deleteHandler, '');

fs.writeFileSync('src/routes/admin.tsx', content, 'utf8');
console.log('Processed admin.tsx');

