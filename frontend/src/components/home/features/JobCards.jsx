import React from 'react'
import { formatSalary, formatEmploymentType, getDaysAgo } from '../../../utils/formatting'
import {motion} from "framer-motion"
import { MapPin , Clock,  Building2} from "lucide-react";
// import { useRouter } from 'next/navigation';

const JobCards = ({data}) => {
    // const router = useRouter();
    const {job_post_id, title, employment_type, salary_start, salary_end, experience, location, summary, company, created_at, industry} = data
    const fallback = company.image?false:true
    return (
        <motion.div 
            className="
                bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl cursor-pointer 
                backdrop-blur-[10px] border border-white/10"
            variants={{
                hover: {
                    y: "-10px", 
                    borderColor: "#667eea",
                    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.2)"
                }
            }}
            whileHover="hover"
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Job Header */}
            <div className="flex items-start justify-between mb-6">

                <div className="flex items-center gap-4">
                    {/* Company Image */}

                    {
                        fallback? 
                            (<div className="
                                company-logo min-w-14 min-h-14 
                                bg-linear-to-br from-blue-500 to-purple-600 
                                rounded-xl flex items-center justify-center text-2xl text-purple-950"
                            >
                                <Building2/>
                            </div>
                        )
                        : (
                            <div className="min-w-14 min-h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                <img src={company.image} alt={company.name} className="w-12 h-12 object-contain" />
                            </div>
                        )
                    }
                    
                    {/* Job Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-1 text-purple-400 ">{title}</h3>
                        <div className="text-slate-400 text-sm">{company.name}</div>
                    </div>
                </div>
                <span className="text-xs text-slate-500">{getDaysAgo(created_at)}</span>
            </div>



            {/* Job Details */}
            <p className="text-slate-300 mb-5 leading-relaxed text-sm">{summary}</p>

            <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center justify-center px-3 py-1 bg-[rgba(102,126,234,0.2)] border border-purple-500/30 rounded-full text-xs text-purple-200 capitalize">
                    <MapPin className="mr-1 w-3 h-3"/> {location}
                </span>
                <span className="flex items-center justify-center px-3 py-1 bg-pink-500/20 border-pink-500/30 rounded-full text-xs text-purple-200 capitalize">
                    <Clock className="mr-1 w-3 h-3"/> {formatEmploymentType(employment_type)}
                </span>
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-200">${formatSalary(salary_start)} - ${formatSalary(salary_end)}</span>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-200">
                    {industry}
                </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-sm text-slate-400">
                    Exp: {experience} years
                </div>
                <button onClick={() => {}} className="px-4 py-2  bg-[#667eea] rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    Visit
                </button>
            </div>
        </motion.div>
    )
}
//router.push(`/job_post/${job_post_id}`)
export default JobCards