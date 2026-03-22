export default function ParkingIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" fill="url(#parking-gradient)" rx="12" />
      <defs>
        <linearGradient id="parking-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="car-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Parking spot lines */}
      <line x1="100" y1="240" x2="300" y2="240" stroke="#94a3b8" strokeWidth="3" />
      <line x1="100" y1="240" x2="80" y2="280" stroke="#94a3b8" strokeWidth="3" />
      <line x1="300" y1="240" x2="320" y2="280" stroke="#94a3b8" strokeWidth="3" />

      {/* Car body */}
      <g transform="translate(130, 140)">
        {/* Car shadow */}
        <ellipse cx="70" cy="95" rx="65" ry="10" fill="#000" opacity="0.1" />

        {/* Car base */}
        <path
          d="M10 60 Q10 30 30 25 L50 20 Q60 10 80 10 Q100 10 110 20 L130 25 Q150 30 150 60 L150 75 Q150 85 140 85 L20 85 Q10 85 10 75 Z"
          fill="url(#car-gradient)"
        />

        {/* Car windows */}
        <path
          d="M55 22 L75 15 L95 15 L115 22 L115 35 L55 35 Z"
          fill="#dbeafe"
        />

        {/* Car details */}
        <circle cx="35" cy="75" r="12" fill="#1e293b" />
        <circle cx="35" cy="75" r="6" fill="#94a3b8" />
        <circle cx="125" cy="75" r="12" fill="#1e293b" />
        <circle cx="125" cy="75" r="6" fill="#94a3b8" />

        {/* Headlights */}
        <ellipse cx="145" cy="55" rx="5" ry="8" fill="#fef08a" />
        <ellipse cx="15" cy="55" rx="3" ry="6" fill="#ef4444" />
      </g>

      {/* Timer display */}
      <g transform="translate(260, 100)">
        <rect x="0" y="0" width="100" height="50" rx="8" fill="url(#timer-gradient)" />
        <text x="50" y="32" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">
          02:35
        </text>
      </g>

      {/* Parking icon */}
      <g transform="translate(320, 180)">
        <circle cx="20" cy="20" r="18" fill="#22c55e" />
        <text x="20" y="28" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">P</text>
      </g>

      {/* Time indicator */}
      <g transform="translate(50, 80)">
        <circle cx="25" cy="25" r="22" fill="white" stroke="#10b981" strokeWidth="3" />
        <line x1="25" y1="25" x2="25" y2="12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="25" x2="35" y2="30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
