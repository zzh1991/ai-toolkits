// src/routes/landing/components/KanbanIllustration.tsx
export default function KanbanIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="kanban-bg" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
        </linearGradient>
        <filter id="kanban-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="url(#kanban-bg)" rx="20" />

      {/* Decorative elements */}
      <circle cx="380" cy="40" r="100" fill="#3B82F6" fillOpacity="0.05" />
      <circle cx="20" cy="280" r="80" fill="#8B5CF6" fillOpacity="0.05" />

      {/* Kanban Board Container */}
      <g transform="translate(40, 40)">
        {/* Grid lines */}
        <line x1="160" y1="0" x2="160" y2="220" stroke="#E5E7EB" strokeWidth="1" />
        <line x1="0" y1="110" x2="320" y2="110" stroke="#E5E7EB" strokeWidth="1" />

        {/* Quadrant 1: Important & Urgent */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="155" height="105" rx="8" fill="#FEE2E2" fillOpacity="0.6" />
          <rect x="0" y="0" width="155" height="28" rx="8" fill="#EF4444" fillOpacity="0.2" />
          <text x="77.5" y="20" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="600">
            重要且紧急
          </text>
          {/* Task cards */}
          <rect x="8" y="36" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="44" width="12" height="12" rx="2" fill="#EF4444" fillOpacity="0.3" />
          <rect x="30" y="42" width="80" height="8" rx="2" fill="#374151" />
          <rect x="30" y="54" width="50" height="6" rx="2" fill="#9CA3AF" />

          <rect x="8" y="70" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="78" width="12" height="12" rx="2" fill="#EF4444" fillOpacity="0.3" />
          <rect x="30" y="76" width="60" height="8" rx="2" fill="#374151" />
        </g>

        {/* Quadrant 2: Important & Not Urgent */}
        <g transform="translate(165, 0)">
          <rect x="0" y="0" width="155" height="105" rx="8" fill="#DBEAFE" fillOpacity="0.6" />
          <rect x="0" y="0" width="155" height="28" rx="8" fill="#3B82F6" fillOpacity="0.2" />
          <text x="77.5" y="20" textAnchor="middle" fill="#2563EB" fontSize="10" fontWeight="600">
            重要不紧急
          </text>
          {/* Task card */}
          <rect x="8" y="36" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="44" width="12" height="12" rx="2" fill="#3B82F6" fillOpacity="0.3" />
          <rect x="30" y="42" width="90" height="8" rx="2" fill="#374151" />
          <rect x="30" y="54" width="40" height="6" rx="2" fill="#9CA3AF" />

          <rect x="8" y="70" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="78" width="12" height="12" rx="2" fill="#3B82F6" fillOpacity="0.3" />
          <rect x="30" y="76" width="70" height="8" rx="2" fill="#374151" />
        </g>

        {/* Quadrant 3: Not Important & Urgent */}
        <g transform="translate(0, 115)">
          <rect x="0" y="0" width="155" height="105" rx="8" fill="#FEF3C7" fillOpacity="0.6" />
          <rect x="0" y="0" width="155" height="28" rx="8" fill="#F59E0B" fillOpacity="0.2" />
          <text x="77.5" y="20" textAnchor="middle" fill="#D97706" fontSize="10" fontWeight="600">
            紧急不重要
          </text>
          {/* Task card */}
          <rect x="8" y="36" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="44" width="12" height="12" rx="2" fill="#F59E0B" fillOpacity="0.3" />
          <rect x="30" y="42" width="70" height="8" rx="2" fill="#374151" />
        </g>

        {/* Quadrant 4: Not Important & Not Urgent */}
        <g transform="translate(165, 115)">
          <rect x="0" y="0" width="155" height="105" rx="8" fill="#F3F4F6" fillOpacity="0.6" />
          <rect x="0" y="0" width="155" height="28" rx="8" fill="#6B7280" fillOpacity="0.2" />
          <text x="77.5" y="20" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="600">
            不重要不紧急
          </text>
          {/* Task card */}
          <rect x="8" y="36" width="139" height="28" rx="4" fill="white" filter="url(#kanban-shadow)" />
          <rect x="12" y="44" width="12" height="12" rx="2" fill="#6B7280" fillOpacity="0.3" />
          <rect x="30" y="46" width="60" height="8" rx="2" fill="#9CA3AF" />
        </g>
      </g>

      {/* Floating stats */}
      <g transform="translate(320, 100)">
        <rect x="0" y="0" width="60" height="50" rx="8" fill="white" fillOpacity="0.9" filter="url(#kanban-shadow)" />
        <text x="30" y="22" textAnchor="middle" fill="#1F2937" fontSize="16" fontWeight="700">12</text>
        <text x="30" y="38" textAnchor="middle" fill="#6B7280" fontSize="8">待办任务</text>
      </g>

      <g transform="translate(320, 160)">
        <rect x="0" y="0" width="60" height="50" rx="8" fill="white" fillOpacity="0.9" filter="url(#kanban-shadow)" />
        <text x="30" y="22" textAnchor="middle" fill="#10B981" fontSize="16" fontWeight="700">8</text>
        <text x="30" y="38" textAnchor="middle" fill="#6B7280" fontSize="8">已完成</text>
      </g>
    </svg>
  );
}
