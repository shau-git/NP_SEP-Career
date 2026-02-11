import { Briefcase, UserPlus, Clock, Calendar } from 'lucide-react';
const statItems = (stats) => ([
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
]);

export default statItems