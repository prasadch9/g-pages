import React from 'react';

const safeUrl = (value) => /^(https?:\/\/|\/uploads\/|#)/i.test(value) ? value : '';
const youtubeId = (url) => url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)?.[1] || '';
const videoFile = (url) => /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url);

function inlineContent(text, keyPrefix) {
  const tokenPattern = /(!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  const nodes = [];
  let cursor = 0;
  let match;
  while ((match = tokenPattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${keyPrefix}-${match.index}`;
    if (match[2] !== undefined) {
      const src = safeUrl(match[3]);
      nodes.push(src ? <img key={key} src={src} alt={match[2]} loading="lazy" className="my-5 max-h-[560px] w-full rounded object-contain" /> : match[0]);
    } else if (match[4] !== undefined) {
      const href = safeUrl(match[5]);
      const videoId = href ? youtubeId(href) : '';
      if (videoId) nodes.push(<iframe key={key} src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={match[4]} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="my-5 aspect-video w-full rounded border-0" />);
      else if (href && videoFile(href)) nodes.push(<video key={key} src={href} controls preload="metadata" className="my-5 max-h-[600px] w-full rounded bg-black" />);
      else nodes.push(href ? <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-vermilion underline underline-offset-2">{match[4]}</a> : match[0]);
    } else if (match[6] !== undefined) nodes.push(<strong key={key} className="font-semibold text-ink">{match[6]}</strong>);
    else if (match[7] !== undefined) nodes.push(<em key={key}>{match[7]}</em>);
    else nodes.push(<code key={key} className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.9em]">{match[8]}</code>);
    cursor = tokenPattern.lastIndex;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export default function MarkdownContent({ content = '' }) {
  const lines = String(content || '').replace(/\r/g, '').split('\n');
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}`;
      blocks.push(<Tag key={`heading-${index}`} className="mb-3 mt-8 font-display text-2xl font-semibold leading-tight text-ink first:mt-0">{inlineContent(heading[2], `h-${index}`)}</Tag>);
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''));
      blocks.push(<blockquote key={`quote-${index}`} className="my-6 border-l-4 border-vermilion/50 pl-5 text-lg italic leading-relaxed text-ink/70">{quote.map((item, lineIndex) => <p key={lineIndex}>{inlineContent(item, `q-${index}-${lineIndex}`)}</p>)}</blockquote>);
      continue;
    }
    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const isOrdered = Boolean(ordered);
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(isOrdered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      const List = isOrdered ? 'ol' : 'ul';
      blocks.push(<List key={`list-${index}`} className={`my-4 space-y-2 pl-6 text-[17px] leading-8 text-ink/75 ${isOrdered ? 'list-decimal' : 'list-disc'}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineContent(item, `li-${index}-${itemIndex}`)}</li>)}</List>);
      continue;
    }
    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^\s*(?:#{1,3}\s+|>\s?|[-*]\s+|\d+\.\s+)/.test(lines[index])) paragraph.push(lines[index++]);
    blocks.push(<p key={`paragraph-${index}`} className="my-4 whitespace-pre-line text-[17px] leading-8 text-ink/75">{paragraph.map((item, lineIndex) => <React.Fragment key={lineIndex}>{lineIndex > 0 && <br />}{inlineContent(item, `p-${index}-${lineIndex}`)}</React.Fragment>)}</p>);
  }
  return <div className="blog-markdown">{blocks}</div>;
}
