// Input Component
export const Input = ({ value, onChange, placeholder, type = "text" }) => {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    );
  };
  
  // Button Component
  export const Button = ({ onClick, children, className = "" }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full py-2 rounded-md ${className} bg-blue-600 text-white hover:bg-blue-700`}
      >
        {children}
      </button>
    );
  };
  
  // Card Component
  export const Card = ({ children, className = "" }) => {
    return (
      <div className={`shadow-md rounded-md bg-white p-4 ${className}`}>
        {children}
      </div>
    );
  };
  