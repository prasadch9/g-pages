const configuredApiOrigin = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://plum-tapir-708238.hostingersite.com' : '')).replace(/\/+$/, '').replace(/\/api$/, '');

export default function mediaUrl(value) {
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return value;

  try {
    const parsed = new URL(value, window.location.origin);
    if (!parsed.pathname.startsWith('/uploads/')) return value;
    if (configuredApiOrigin) return `${configuredApiOrigin}${parsed.pathname}${parsed.search}`;
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return value;
  }
}