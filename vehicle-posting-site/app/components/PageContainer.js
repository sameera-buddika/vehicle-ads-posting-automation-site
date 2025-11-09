import Navbar from "./Navbar";

export function PageContainer({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Navbar />
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions = null }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-purple-700 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-4">{actions}</div>}
    </div>
  );
}

export function ContentContainer({ children, maxWidth = "container" }) {
  const widths = {
    container: "container mx-auto",
    sm: "max-w-md mx-auto",
    md: "max-w-2xl mx-auto",
    lg: "max-w-4xl mx-auto",
    xl: "max-w-6xl mx-auto",
    full: "w-full",
  };

  return (
    <div className={`${widths[maxWidth]} px-4 py-8`}>
      {children}
    </div>
  );
}

export function Card({ children, className = "", padding = true }) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

