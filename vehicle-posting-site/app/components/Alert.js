export function Alert({ 
  type = "info", 
  message, 
  onClose = null,
  className = "" 
}) {
  const types = {
    success: {
      bg: "bg-green-100",
      border: "border-green-400",
      text: "text-green-700",
      icon: "✓"
    },
    error: {
      bg: "bg-red-100",
      border: "border-red-400",
      text: "text-red-700",
      icon: "✕"
    },
    warning: {
      bg: "bg-yellow-100",
      border: "border-yellow-400",
      text: "text-yellow-700",
      icon: "⚠"
    },
    info: {
      bg: "bg-blue-100",
      border: "border-blue-400",
      text: "text-blue-700",
      icon: "ℹ"
    }
  };

  const config = types[type] || types.info;

  return (
    <div className={`${config.bg} border ${config.border} ${config.text} px-4 py-3 rounded relative ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">{config.icon}</span>
        <span className="flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="font-bold hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ 
  icon = "📭", 
  title, 
  message, 
  actionText = null, 
  onAction = null 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <span className="text-6xl mb-4 block">{icon}</span>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      {message && <p className="text-gray-600 mb-6">{message}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition font-semibold"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

