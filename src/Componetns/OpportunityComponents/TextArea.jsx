import React from 'react';

export default function TextArea({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  required = false,
  error = null
}) {
  return (
    <div className="form-control w-full mb-4">
      {label && (
        <label className="label">
          <span className="label-text font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`}
        required={required}
      ></textarea>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}