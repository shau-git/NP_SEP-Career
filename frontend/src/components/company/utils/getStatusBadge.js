const getStatusBadge = (status) => {
    const styles = {
    PENDING: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200',
    INTERVIEW: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
    ACCEPTED: 'bg-green-500/20 border-green-500/30 text-green-200',
    REJECTED: 'bg-red-500/20 border-red-500/30 text-red-200',
    WITHDRAWN: 'bg-gray-500/20 border-gray-500/30 text-gray-200'
    };
    return styles[status] || styles.PENDING;
};

export default getStatusBadge