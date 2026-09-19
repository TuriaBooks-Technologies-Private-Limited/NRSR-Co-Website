/**
 * Lightweight & secure Markdown to HTML parser for Blogs and Case Studies.
 */
export function parseMarkdown(md: string = ''): string {
  if (!md) return '';

  let html = md
    // Escape script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Parse markdown tables before other line replacements
  html = html.replace(/(?:^|\n)(\|.+?\|\n\|[-:\s|]+\|\n(?:\|.+?\|\n?)+)/g, (match) => {
    const lines = match.trim().split('\n');
    if (lines.length < 3) return match;
    
    const headers = lines[0].split('|').slice(1, -1).map(h => h.trim());
    const rows = lines.slice(2).map(line => line.split('|').slice(1, -1).map(c => c.trim()));

    let tableHtml = '<div class="article-table-wrapper"><table class="article-table"><thead><tr>';
    headers.forEach(h => {
      tableHtml += `<th>${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    rows.forEach(row => {
      tableHtml += '<tr>';
      row.forEach(c => {
        tableHtml += `<td>${c}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    return `\n\n${tableHtml}\n\n`;
  });

  html = html
    // Horizontal Rules
    .replace(/^---$/gim, '<hr class="article-hr" />')
    // Headers
    .replace(/^#### (.*$)/gim, '<h4 class="article-h4">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="article-h3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="article-h2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="article-h1">$1</h1>')
    // Callouts / Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="article-callout">$1</blockquote>')
    // Links [Text](URL)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="article-link" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="article-code">$1</code>')
    // Unordered lists
    .replace(/^\s*-\s+(.*$)/gim, '<li class="article-li">$1</li>')
    .replace(/^\s*\*\s+(.*$)/gim, '<li class="article-li">$1</li>')
    // Ordered lists
    .replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="article-li-num" data-num="$1">$2</li>');

  // Wrap adjacent list items in <ul> or <ol>
  html = html.replace(/(<li class="article-li">[\s\S]*?<\/li>)/gim, '<ul class="article-ul">$1</ul>');
  html = html.replace(/(<li class="article-li-num"[^>]*>[\s\S]*?<\/li>)/gim, '<ol class="article-ol">$1</ol>');
  // Clean up duplicate wrapping
  html = html.replace(/<\/ul>\s*<ul class="article-ul">/gim, '');
  html = html.replace(/<\/ol>\s*<ol class="article-ol">/gim, '');

  // Paragraphs
  const blocks = html.split(/\n\s*\n/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|ul|ol|blockquote|div|p|table|hr)/i.test(block)) {
      return block;
    }
    return `<p class="article-p">${block.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n\n');

  return html;
}
