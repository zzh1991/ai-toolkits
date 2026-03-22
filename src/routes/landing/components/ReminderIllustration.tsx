// src/routes/landing/components/ReminderIllustration.tsx
export default function ReminderIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="reminder-bg" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="reminder-card" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F3F4F6" stopOpacity="0.8" />
        </linearGradient>
        <filter id="reminder-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="url(#reminder-bg)" rx="20" />

      {/* Decorative circles */}
      <circle cx="350" cy="50" r="80" fill="#8B5CF6" fillOpacity="0.1" />
      <circle cx="50" cy="250" r="60" fill="#EC4899" fillOpacity="0.1" />

      {/* Calendar card */}
      <g transform="translate(100, 60)">
        <rect
          x="0"
          y="0"
          width="200"
          height="180"
          rx="16"
          fill="url(#reminder-card)"
          filter="url(#reminder-glow)"
        />
        {/* Calendar header */}
        <rect x="0" y="0" width="200" height="50" rx="16" fill="#8B5CF6" />
        <rect x="0" y="34" width="200" height="16" fill="#8B5CF6" />
        <text x="100" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
          纪念日
        </text>

        {/* Days */}
        <text x="100" y="110" textAnchor="middle" fill="#1F2937" fontSize="48" fontWeight="700">
          128
        </text>
        <text x="100" y="140" textAnchor="middle" fill="#6B7280" fontSize="14">
          天
        </text>

        {/* Progress ring */}
        <circle
          cx="100"
          cy="105"
          r="70"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
          strokeDasharray="440"
          strokeDashoffset="110"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="105"
          r="70"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeDasharray="440"
          strokeDashoffset="330"
          strokeLinecap="round"
          transform="rotate(-90 100 105)"
        />
      </g>

      {/* Small floating elements */}
      <g transform="translate(40, 80)">
        <rect x="0" y="0" width="60" height="70" rx="8" fill="white" fillOpacity="0.8" />
        <rect x="0" y="0" width="60" height="20" rx="8" fill="#EC4899" />
        <text x="30" y="50" textAnchor="middle" fill="#1F2937" fontSize="16" fontWeight="700">
          30
        </text>
      </g>

      <g transform="translate(300, 160)">
        <rect x="0" y="0" width="60" height="70" rx="8" fill="white" fillOpacity="0.8" />
        <rect x="0" y="0" width="60" height="20" rx="8" fill="#10B981" />
        <text x="30" y="50" textAnchor="middle" fill="#1F2937" fontSize="16" fontWeight="700">
          7
        </text>
      </g>
    </svg>
  );
}
