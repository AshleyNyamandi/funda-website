import React from 'react';

export const ToolbarButton = ({
  onClick,
  isActive = false,
  icon: Icon,
  tooltip,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tooltip: string;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
    }`}
    title={tooltip}
    type="button"
  >
    <Icon size={18} />
  </button>
);

export default ToolbarButton;
