import { Briefcase, UserPlus, Clock, Calendar } from 'lucide-react';
import statItems from '../../utils/statItem';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="text-center">
        <div className="flex items-center justify-center">
            <Icon className={`w-8 h-8 ${colorClass.text}`} />
        </div>
        <div className="text-2xl font-bold">{value||0}</div>
        <div className="text-white/60 text-sm">{title}</div>
    </div>

);

// This is the main function component
const Stats = ({ stats, loading }) => {
    if (loading) {
        return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
            ))}
        </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 bg-white/5 rounded-xl p-4 border border-white/10 ">
            {statItems(stats).map((item, index) => (
                <StatCard key={index} {...item} colorClass={item.color} />
            ))}
        </div>
    );
};

export default Stats;