import {Briefcase, Building2, TrendingUp, Zap} from 'lucide-react';

const Stats = () => {
    const data = [
        {value: "100+", icon: Briefcase, label: "Active Jobs"},
        {value: "60+", icon: Building2, label: "Companies"},
        {value: "12", icon: TrendingUp, label: "New Today"},
        {value: "87%", icon: Zap, label: "Success Rate"}
    ]
    return (
        <section className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 ">
            {
                data.map(data => (
                    <div className="text-center" key={data.label}>
                        <div className="flex items-center justify-center mb-2">
                            <data.icon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white via-purple-300 to-purple-500">
                            {data.value}
                        </div>
                        <div className="text-slate-400">{data.label}</div>
                    </div>
                ))
            }
            
        </section>
    )
}

export default Stats