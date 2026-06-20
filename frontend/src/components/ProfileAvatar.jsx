import { useState } from 'react';
import { mediaUrl, profileInitials, profileAvatarColors } from './media.js';

function InitialsAvatar({ name, className, textClassName }) {
  const { bg, fg } = profileAvatarColors(name);
  return (
    <div
      className={`${className} rounded-full grid place-items-center font-semibold shrink-0 border border-stone-200/80`}
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className={textClassName}>{profileInitials(name)}</span>
    </div>
  );
}

export default function ProfileAvatar({
  url,
  name,
  className = 'w-12 h-12',
  textClassName = 'text-lg',
}) {
  const [failed, setFailed] = useState(false);
  const src = mediaUrl(url);

  if (!src || failed) {
    return <InitialsAvatar name={name} className={className} textClassName={textClassName} />;
  }

  return (
    <img
      src={src}
      alt=""
      className={`${className} rounded-full object-cover border border-stone-200 shrink-0 bg-white`}
      onError={() => setFailed(true)}
    />
  );
}
