const configuredApiOrigin = (import.meta.env?.VITE_API_URL || (import.meta.env?.PROD ? 'https://plum-tapir-708238.hostingersite.com' : ''))
  .replace(/\/api\/?$/, '')
  .replace(/\/+$/, '');

const getYouTubeId = (url) => {
  const host = url.hostname.toLowerCase();
  if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
  return url.searchParams.get('v')
    || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]
    || '';
};

const getGoogleDriveId = (url) => url.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
  || url.searchParams.get('id')
  || '';

export function parseVideoUrl(value) {
  const rawUrl = String(value || '').trim();
  if (!rawUrl) return null;

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return null;

  const host = url.hostname.toLowerCase();
  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id = getYouTubeId(url);
    return id ? { type: 'youtube', url: url.toString(), embedUrl: `https://www.youtube.com/embed/${id}` } : null;
  }
  if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) {
    const id = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
    return id ? { type: 'vimeo', url: url.toString(), embedUrl: `https://player.vimeo.com/video/${id}` } : null;
  }
  if (host === 'drive.google.com') {
    const id = getGoogleDriveId(url);
    const embedUrl = id ? `https://drive.google.com/file/d/${id}/preview` : url.pathname.endsWith('/preview') ? url.toString() : '';
    return embedUrl ? { type: 'google', url: url.toString(), embedUrl } : null;
  }
  if (/\.(mp4|webm|mov|avi|mkv|ogg|m4v)$/i.test(url.pathname) || url.pathname.includes('/uploads/')) {
    return { type: 'direct', url: url.toString(), embedUrl: '' };
  }
  return null;
}

export function resolveVideoPlayback(video) {
  const rawUrl = typeof video === 'string' ? video : video?.url || video?.src || video?.videoUrl || '';
  if (!rawUrl) return null;

  const explicitType = typeof video === 'object' ? video.type : '';
  let sourceUrl = String(rawUrl).trim();
  if (sourceUrl.startsWith('/uploads/') && configuredApiOrigin) {
    sourceUrl = `${configuredApiOrigin}${sourceUrl}`;
  } else if (sourceUrl.startsWith('/') && typeof window !== 'undefined') {
    sourceUrl = new URL(sourceUrl, window.location.origin).toString();
  }

  let details = parseVideoUrl(sourceUrl);
  if (!details && ['upload', 'direct'].includes(explicitType) && /^https?:\/\//i.test(sourceUrl)) {
    details = { type: explicitType, url: sourceUrl, embedUrl: '' };
  }
  if (!details) return { type: 'url', url: sourceUrl, embedUrl: '' };
  if (explicitType === 'upload' && details.type === 'direct') details.type = 'upload';
  return details;
}