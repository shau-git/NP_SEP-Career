const Badge = ({ 
  children, 
  icon: Icon, 
  variant = 'purple', 
}) => {
    // Define style maps for different colors
    const variants = {
        purple: "bg-[rgba(102,126,234,0.2)] border-purple-500/30 text-purple-200",
        pink: "bg-pink-500/20 border-pink-500/30 text-purple-200",
        green: "bg-green-500/20 border-green-500/30 text-green-200",
        cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-200",
        red: "bg-red-500/50 border-red-500/50 text-red-200",
    };

    return (
        <span className={`flex items-center justify-center px-3 py-1 border rounded-full text-xs capitalize ${variants[variant]}`}>
            {Icon && <Icon className="mr-1 w-3 h-3" />}
            {children}
        </span>
    );
};

export default Badge;