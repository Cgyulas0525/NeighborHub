const PALETTES = {
  default: { bg: '#e8f0e6', primary: '#4a7c3f', secondary: '#2d4a2b', accent: '#6bbf59', light: '#ffffff' },
  admin: { bg: '#1f3520', primary: '#6bbf59', secondary: '#8fd97f', accent: '#ffffff', light: '#ffffff' },
};

export const LOGO_DESIGNS = [
  { id: 'houses', name: 'Házikók', description: 'Helyi település, szomszédok egy utcában' },
  { id: 'pin', name: 'Helyi térkép', description: 'Környék felfedezése, helyi ajánlások' },
  { id: 'hub', name: 'Közösségi háló', description: 'Összekapcsolt emberek, megbízható hálózat' },
];

function ClassicMark({ p }) {
  return (
    <>
      <path
        d="M10 38c2-8 8-14 16-15 3-.5 5 1 6 3 1-2 3-4 6-4 4 0 7 3 7 7 0 2-1 4-2 5 1 0 2 1 2 2 0 2-2 3-4 3-2 0-3-1-4-2-1 1-3 2-5 2-4 0-7-2-9-5-2 1-4 2-6 2-2 0-4-1-5-3 0-1 0-2 1-3z"
        fill={p.primary}
      />
      <path
        d="M54 38c-2-8-8-14-16-15-3-.5-5 1-6 3-1-2-3-4-6-4-4 0-7 3-7 7 0 2 1 4 2 5-1 0-2 1-2 2 0 2 2 3 4 3 2 0 3-1 4-2 1 1 3 2 5 2 4 0 7-2 9-5 2 1 4 2 6 2 2 0 4-1 5-3 0-1 0-2-1-3z"
        fill={p.secondary}
      />
      <ellipse cx="32" cy="34" rx="6" ry="4" fill={p.light} opacity="0.35" />
      <path d="M28 36c2 2 6 2 8 0" stroke={p.secondary} strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

function HousesMark({ p }) {
  return (
    <>
      <path d="M8 44h48v4H8z" fill={p.secondary} opacity="0.25" />
      <g fill={p.primary}>
        <rect x="11" y="34" width="14" height="10" rx="1" />
        <path d="M18 26 L11 34 L25 34 Z" />
        <rect x="15" y="38" width="5" height="6" rx="0.5" fill={p.light} opacity="0.45" />
      </g>
      <g fill={p.secondary}>
        <rect x="25" y="28" width="16" height="16" rx="1" />
        <path d="M33 18 L25 28 L41 28 Z" />
        <rect x="30" y="34" width="6" height="10" rx="0.5" fill={p.light} opacity="0.35" />
        <rect x="37" y="32" width="4" height="4" rx="0.5" fill={p.light} opacity="0.35" />
      </g>
      <g fill={p.accent}>
        <rect x="43" y="36" width="12" height="8" rx="1" />
        <path d="M49 29 L43 36 L55 36 Z" />
        <rect x="47" y="39" width="4" height="5" rx="0.5" fill={p.light} opacity="0.4" />
      </g>
      <circle cx="32" cy="44" r="2" fill={p.accent} opacity="0.6" />
    </>
  );
}

function PinMark({ p }) {
  return (
    <>
      <path
        d="M32 12c-7.2 0-13 5.8-13 13 0 9.5 13 23 13 23s13-13.5 13-23c0-7.2-5.8-13-13-13z"
        fill={p.primary}
      />
      <circle cx="32" cy="25" r="9" fill={p.light} opacity="0.92" />
      <circle cx="28" cy="24" r="2.5" fill={p.secondary} />
      <circle cx="36" cy="24" r="2.5" fill={p.secondary} />
      <path
        d="M27 29c2 2 6 2 10 0"
        stroke={p.primary}
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 27c-1.5 0-2.5 1-2.5 2.2 0 2.8 10.5 8.8 10.5 8.8S42.5 32 42.5 29.2C42.5 28 41.5 27 40 27"
        stroke={p.accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </>
  );
}

function HubMark({ p }) {
  const nodes = [
    [32, 14],
    [47, 22],
    [47, 40],
    [32, 48],
    [17, 40],
    [17, 22],
  ];

  return (
    <>
      {nodes.map(([cx, cy]) => (
        <line
          key={`l-${cx}-${cy}`}
          x1="32"
          y1="32"
          x2={cx}
          y2={cy}
          stroke={p.primary}
          strokeWidth="2"
          opacity="0.35"
        />
      ))}
      <circle cx="32" cy="32" r="7" fill={p.secondary} />
      <circle cx="32" cy="32" r="3.5" fill={p.light} opacity="0.45" />
      {nodes.map(([cx, cy], i) => (
        <circle key={`n-${i}`} cx={cx} cy={cy} r="4" fill={i % 2 === 0 ? p.primary : p.accent} />
      ))}
    </>
  );
}

function LogoMark({ design, palette }) {
  switch (design) {
    case 'houses':
      return <HousesMark p={palette} />;
    case 'pin':
      return <PinMark p={palette} />;
    case 'hub':
      return <HubMark p={palette} />;
    default:
      return <ClassicMark p={palette} />;
  }
}

export default function Logo({
  className = 'h-9 w-9',
  showText = false,
  variant = 'default',
  design = 'hub',
}) {
  const isAdmin = variant === 'admin';
  const palette = isAdmin ? PALETTES.admin : PALETTES.default;

  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={showText}
        role={showText ? undefined : 'img'}
        aria-label={showText ? undefined : 'NeighborHub logó'}
      >
        <rect width="64" height="64" rx="14" fill={palette.bg} />
        <LogoMark design={design} palette={palette} />
      </svg>
      {showText && (
        <span className={`text-[23px] font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-emerald-800'}`}>
          NeighborHub
          {isAdmin && <span className="text-emerald-300 font-normal"> admin</span>}
        </span>
      )}
    </span>
  );
}
