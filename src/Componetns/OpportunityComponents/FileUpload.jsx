import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function FileUpload({
  label,
  onChange,
  accept = '*',
  required = false,
  error = null
}) {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

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
      <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        error ? 'border-red-500 bg-red-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
      }`}>
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm font-semibold text-gray-700">
            {fileName || 'Click to upload or drag and drop'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {accept === '*' ? 'Any file' : accept}
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          required={required}
        />
      </label>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}