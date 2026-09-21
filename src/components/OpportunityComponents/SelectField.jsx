import React from 'react';

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`select select-bordered w-full ${error ? 'select-error' : ''}`}
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}