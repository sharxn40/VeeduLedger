import React from 'react';

const FormInput = ({ label, icon: Icon, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />}
        <input 
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
        />
      </div>
    </div>
  );
};

export default FormInput;
