import statItems from '../../utils/statItem';
import {Eye, Building2, X, DollarSign, Calendar, Briefcase, Clock } from "lucide-react"
import {useState, useEffect} from "react"
import {getStatusBadge} from "../company/utils/company_util_config"
import {Link} from "react-router-dom"
import {motion} from "framer-motion"

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="text-center">
        <div className="flex items-center justify-center">
            <Icon className={`w-8 h-8 ${colorClass.text}`} />
        </div>
        <div className="text-2xl font-bold text-white">{value||0}</div>
        <div className="text-white/60 text-sm">{title === "Applicants" ? "Applications" : title}</div>
    </div>
);

const ViewDetail = ({setOpenAppModal}) => (
    <button 
        onClick={() => setOpenAppModal(true)}
        className="cursor-pointer mt-2 flex items-center justify-center w-full sm:px-4 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
    >
        <Eye className="w-4 h-4" />
        <span className="ml-2">View Details</span> 
    </button>
)

// This is the main function component
const Stats = ({ stats , jobApp}) => {
    const [openAppModal, setOpenAppModal] = useState(false)

    useEffect(() => {
        if (openAppModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openAppModal]);

    return (
        <div className="relative">
            {/* User Application detail */}
            {openAppModal && <div className="text-gray-400 fixed inset-0 bg-black/80 flex  justify-center z-50 p-4 backdrop-blur-xs">
                    <div className="relative overflow-y-scroll bg-slate-900 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-slate-700 ">
                        <div className="bg-slate-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700 flex flex-col justify-between sticky top-0 z-10 left-0 right-0">
                            {/* tile */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-2xl font-bold text-white">Application History</h2>
                                <button
                                    onClick={() => setOpenAppModal(false)}
                                    className="cursor-pointer text-slate-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-slate-700 rounded-lg shrink-0"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                        {/* Application history */}
                        <div className="grid gap-3 lg:gap-4 p-3">
                            {jobApp.length > 0 ? 
                                (jobApp.map((job) => {
                                    const {applicant_id, applied_date, interview_date, job_post_id, expected_salary, status} = job
                                    const {industry, title} = job.job_post
                                    const {image, name } = job.job_post.company
                                    return (
                                        <div key={applicant_id} className="bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/10">
                                            <div className="flex items-start justify-between mb-3">

                                                <div className="flex items-start gap-4">
                                                    {/* Company Image */}

                                                    {
                                                        image? 
                                                            (<div className="
                                                                company-logo min-w-13 min-h-13 
                                                                bg-linear-to-br from-blue-500 to-purple-600 
                                                                rounded-xl flex items-center justify-center text-2xl text-purple-950"
                                                            >
                                                                <Building2/>
                                                            </div>
                                                        )
                                                        : (
                                                            <div className="min-w-13 min-h-13 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                                                <img src={image} alt={name} className="w-12 h-12 object-contain" />
                                                            </div>
                                                        )
                                                    }
                                                    
                                                    {/* Job & Company name */}
                                                    <div>
                                                        <h3 className="text-[18px] font-bold mb-1 text-purple-400 flex-wrap">{title}</h3>
                                                        <div className="text-slate-400 text-sm">{name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Job's industry, User expected salary, applied date, interview date */}
                                            <div>
                                                <span className={`px-2 lg:px-3 py-1 border rounded-full text-xs ${getStatusBadge(status)}`}>
                                                    {status}
                                                </span>
                                                <div className="space-y-1 text-xs lg:text-sm mt-3">
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <Briefcase  className="w-3 lg:w-4 h-3 lg:h-4" />
                                                        Industry: {industry}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <DollarSign className="w-3 lg:w-4 h-3 lg:h-4" />
                                                        Expected: <span className="text-green-500">${expected_salary}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <Calendar className="w-3 lg:w-4 h-3 lg:h-4" />
                                                        Applied: {new Date(applied_date).toLocaleDateString()}
                                                    </div>
                                                    {interview_date && (
                                                        <div className="flex items-center gap-2 text-blue-300">
                                                            <Clock className="w-3 lg:w-4 h-3 lg:h-4" />
                                                            Interview: {new Date(interview_date).toLocaleDateString()} {job.interview_time}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <motion.button 
                                                    whileHover={{
                                                        boxShadow: "0 0 25px rgba(168,85,247,0.5)",
                                                    }}
                                                    className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg text-[14px]"
                                                >
                                                    <Link 
                                                        to={`/job_post/${job_post_id}`}
                                                        target="_blank"
                                                    >
                                                        Visit
                                                    </Link>
                                                </motion.button>
                                            </div>
                                        </div>)
                                    })
                                ): (<div>No Job Application History</div>)
                            }
                        </div>
                    </div>
                </div>
            }

            {/* User Application Stats */}
            <div className="relative bg-white/5 rounded-xl p-4 border border-white/10 max-w-7xl mx-auto" >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 ">
                    {statItems(stats).slice(1).map((item, index) => (
                        <StatCard key={index} {...item} colorClass={item.color} />
                    ))}
                    <div className="sm:hidden inline"><ViewDetail {...{setOpenAppModal}}/></div>
                </div>
                <div className="sm:inline hidden"><ViewDetail {...{setOpenAppModal}}/></div>
            </div>
        </div>
    );
};

export default Stats;