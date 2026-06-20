export default function Logo({ className = 'h-9 w-9', showText = false, variant = 'default' }) {
  const isAdmin = variant === 'admin';

  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="64" height="64" rx="14" fill={isAdmin ? '#1f3520' : '#e8f0e6'} />
        {/* left hand */}
        <path
          d="M10 38c2-8 8-14 16-15 3-.5 5 1 6 3 1-2 3-4 6-4 4 0 7 3 7 7 0 2-1 4-2 5 1 0 2 1 2 2 0 2-2 3-4 3-2 0-3-1-4-2-1 1-3 2-5 2-4 0-7-2-9-5-2 1-4 2-6 2-2 0-4-1-5-3 0-1 0-2 1-3z"
          fill={isAdmin ? '#6bbf59' : '#4a7c3f'}
        />
        {/* right hand */}
        <path
          d="M54 38c-2-8-8-14-16-15-3-.5-5 1-6 3-1-2-3-4-6-4-4 0-7 3-7 7 0 2 1 4 2 5-1 0-2 1-2 2 0 2 2 3 4 3 2 0 3-1 4-2 1 1 3 2 5 2 4 0 7-2 9-5 2 1 4 2 6 2 2 0 4-1 5-3 0-1 0-2-1-3z"
          fill={isAdmin ? '#8fd97f' : '#2d4a2b'}
        />
        {/* clasp / connection */}
        <ellipse cx="32" cy="34" rx="6" ry="4" fill={isAdmin ? '#ffffff' : '#ffffff'} opacity="0.35" />
        <path
          d="M28 36c2 2 6 2 8 0"
          stroke={isAdmin ? '#ffffff' : '#2d4a2b'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={`text-xl font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-emerald-800'}`}>
          NeighborHub
          {isAdmin && <span className="text-emerald-300 font-normal"> admin</span>}
        </span>
      )}
    </span>
  );
}
