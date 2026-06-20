const PALETTES = [
  { bg: '#e8f0e6', fg: '#2d4a2b' },
  { bg: '#d4e8cf', fg: '#3d6335' },
  { bg: '#c4dcc0', fg: '#4a7c3f' },
  { bg: '#eef5ea', fg: '#1f3520' },
  { bg: '#dfebd9', fg: '#2d4a2b' },
];

export function mediaUrl(url) {
  if (!url) return null;
  if (url.startsWith('/')) return url;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export function profileInitials(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return trimmed.charAt(0).toUpperCase();
}

export function profileAvatarColors(name) {
  const key = (name || '').trim() || '?';
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

export function isGeneratedAvatarPath(path) {
  return typeof path === 'string' && path.includes('profiles/avatars/');
}
