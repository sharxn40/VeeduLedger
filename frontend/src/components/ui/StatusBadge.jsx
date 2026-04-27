import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    vacant: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      dot: 'bg-emerald-500'
    },
    occupied: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      dot: 'bg-amber-500'
    }
  };

  const style = config[status.toLowerCase()] || config.vacant;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
