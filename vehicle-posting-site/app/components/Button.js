export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
  ...props 
}) {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 transform";
  
  const variants = {
    primary: "bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg disabled:bg-gray-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md disabled:bg-gray-100",
    success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg disabled:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg disabled:bg-gray-400",
    warning: "bg-yellow-400 text-purple-900 hover:bg-yellow-500 hover:shadow-lg disabled:bg-gray-400",
    info: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400",
    outline: "border-2 border-purple-700 text-purple-700 hover:bg-purple-50 hover:shadow-md disabled:border-gray-300 disabled:text-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:cursor-not-allowed`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export function IconButton({ icon, onClick, variant = "primary", title, ...props }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 transform ${
        variant === "danger" ? "text-red-600 hover:bg-red-50" : 
        variant === "primary" ? "text-purple-700 hover:bg-purple-50" :
        "text-gray-600 hover:bg-gray-100"
      }`}
      {...props}
    >
      {icon}
    </button>
  );
}

