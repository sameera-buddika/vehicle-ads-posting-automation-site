export function FormInput({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error = null,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  placeholder = "Select option",
  required = false,
  error = null,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function FormTextarea({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 4,
  error = null,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none transition`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export function FormImageUpload({ 
  label, 
  name, 
  onChange, 
  required = false,
  currentImage = null,
  preview = null,
  error = null,
  helpText = null,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {currentImage && !preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Image:</p>
          <img
            src={currentImage}
            alt="Current"
            className="max-w-md rounded-lg border-2 border-gray-300"
          />
        </div>
      )}
      
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        required={required}
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none`}
        {...props}
      />
      
      {helpText && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-md rounded-lg border-2 border-gray-300"
          />
        </div>
      )}
    </div>
  );
}

