import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, description, icon: Icon, actionText, actionLink }) => {
  return (
    <div className="card p-20 text-center border-dashed bg-white/50">
      {Icon && (
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">{description}</p>
      {actionText && actionLink && (
        <Link 
          to={actionLink}
          className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
