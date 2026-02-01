const formatSalary = (num) => {
    if (num >= 1_000_000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}


const formatEmploymentType = (type) => (
    type === 'full time' ? 'Full-time' : 
    type === 'part time' ? 'Part-time' : 
    type
)

const getDaysAgo = (dateStr) => {
    const posted = new Date(dateStr);
    const today = new Date();
    const days = Math.floor((today - posted) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
};


const formatDate = (dateStr) => {
    if (dateStr.toLowerCase() === "present") return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export {
    formatSalary,
    formatEmploymentType,
	getDaysAgo,
    formatDate
}