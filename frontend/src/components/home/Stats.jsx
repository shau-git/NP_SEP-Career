import {Briefcase, Building2, TrendingUp, Zap, UserRoundCheck} from 'lucide-react';
import {getPlatformStats} from "../../utils/fetch_data/fetch_config"
import {useEffect, useState} from "react"
import {toast} from "react-toastify"

const Stats = () => {
    // 1. Initialize state with 0s so the UI doesn't look empty while loading
    const [stats, setStats] = useState({
        jobs: 0,
        companies: 0,
        newToday: 0,
        successRate: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await getPlatformStats();
            const result = await response.json();
            console.log(result)
            if (response.status === 200) {
                // 2. Update state with real data from backend
                setStats({
                    jobs: result.data.jobs,
                    companies: result.data.companies,
                    newToday: result.data.newToday || 0 ,
                    successRate: result.data.successRate,
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Stats error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats()
    },[])

    // 3. Create the display array using the state values
    const displayData = [
        { value: stats.jobs, icon: Briefcase, label: "Active Jobs" },
        { value: stats.companies, icon: Building2, label: "Companies" },
        { value: stats.newToday, icon: TrendingUp, label: "New Today" },
        { value: `${stats.successRate}%`, icon: Zap, label: "Success Rate" }
    ];

    return (
        <section className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 ">
            {
                displayData.map((data, i) => (
                    <div className="text-center" key={data.label}>
                        <div className="flex items-center justify-center mb-2">
                            <data.icon className={`w-8 h-8 text-blue-400 ${loading ? 'animate-pulse' : ''}`}/>
                        </div>
                        <div className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white via-purple-300 to-purple-500">
                            {/* Use toLocaleString for nice commas (e.g., 1,200) */}
                            {i === 3 ? data.value :data.value.toLocaleString()}
                        </div>
                        <div className="text-slate-400">{data.label}</div>
                    </div>
                ))
            }
            
        </section>
    )
}

export default Stats