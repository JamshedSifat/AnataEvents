import React from 'react';

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = null
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
        required={required}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}