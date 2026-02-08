import { Briefcase, UserPlus, Clock, Calendar } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="text-center">
        <div className="flex items-center justify-center">
            <Icon className={`w-8 h-8 ${colorClass.text}`} />
        </div>
        <div className="text-2xl font-bold">{value||0}</div>
        <div className="text-white/60 text-sm">{title}</div>
    </div>

);

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

    const statItems = [
        {
            title: "Job Post",
            value: stats?.totalJobPosts,
            icon: Briefcase,
            color: { bg: "bg-blue-50", text: "text-blue-400" }
        },
        {
            title: "Applicants",
            value: stats?.totalApplicants,
            icon: UserPlus ,
            color: { bg: "bg-purple-50", text: "text-green-400" }
        },
        {
            title: "Pending",
            value: stats?.pending,
            icon: Clock,
            color: { bg: "bg-amber-50", text: "text-amber-400" }
        },
        {
            title: "Interview",
            value: stats?.pendingInterview,
            icon: Calendar,
            color: { bg: "bg-indigo-50", text: "text-indigo-400" }
        }
    ];
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 bg-white/5 rounded-xl p-4 border border-white/10 ">
            {statItems.map((item, index) => (
                <StatCard key={index} {...item} colorClass={item.color} />
            ))}
        </div>
    );
};

export default Stats;