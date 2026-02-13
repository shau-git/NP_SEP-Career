import { useState, useEffect} from 'react'
import {getOneJobPost, createApplicant} from "../utils/fetch_data/fetch_config"
import { 
  MapPin, Briefcase, Clock, DollarSign, Calendar, 
  Building2, Mail, Check, X
} from 'lucide-react';
import { toast } from "react-toastify"
import Loading from "../components/Loading"
import { useParams , useNavigate } from 'react-router-dom';
import {getDaysAgo} from "../utils/formatting"
import Login from '../components/auth/Login';
import {motion} from "framer-motion"

export default function JobPostPage({setFetchCount}) {
    let { job_post_id } = useParams();
    job_post_id = parseInt(job_post_id)

    const navigate = useNavigate();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [jobPost, setJobPost] = useState(null)
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [expectedSalary, setExpectedSalary] = useState('');

    const fetchJobPost = async () => {
        const response = await getOneJobPost(job_post_id)
        const data = await response.json();

        if(response.status === 200) {
            setJobPost(data.data)
        } else if (response.status === 404) {
            toast.error(data.message)
            return navigate('/')
        } else {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        if(!job_post_id) {
            toast.error("Job Post Id must be a number")
            return navigate('/')
        }
        const token = localStorage.getItem('token')
        setSession(JSON.parse(localStorage.getItem('user')))
        setToken(token)
        fetchJobPost()
        // fetch the latest unread notification
        if(token)setFetchCount(true)
    }, [])

    if (!jobPost) {
        return (
            <Loading/>
        )
    }

    // function for user when click to apply job
    const handleApplyReq = () => {
        if(!token || ! session){
            setOpenLoginModal(true)
            toast.error("Login or Sign Up to apply job!")
            return
        }
        setShowApplyModal(true)
    }

    // proceed to apply job
    const handleApplyJob = async () => {
        try {
            const response = await createApplicant (job_post_id, {expected_salary: expectedSalary}, token)
            const data = await response.json()
            if (response.status === 201) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error){
            toast.error(error)
            console.error(error)
        }
        setShowApplyModal(false);
        setExpectedSalary('');
        // fetch the latest unread notification, user can only login to apply a job
        setFetchCount(true)
    };


    const fallback = jobPost?.company?.image?false:true    

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {openLoginModal && <Login {...{setOpenLoginModal, active:null, openLoginModal, setToken, setSession}}/>}
            {/* Main Content */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Job Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Job Header */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <div className="flex items-start gap-6 mb-6">
                                    
                                    {
                                        fallback? (<div className="
                                                company-logo min-w-14 min-h-14 
                                                bg-linear-to-br from-blue-500 to-purple-600 
                                                rounded-xl flex items-center justify-center text-2xl text-purple-950"
                                            >
                                                <Building2/>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={jobPost?.company?.image} alt={jobPost.company.name} className="w-16 h-16 object-contain" />
                                            </div>
                                        )
                                    }
                                    
                                    <div className="flex-1">
                                        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2">{jobPost.title}</h1>
                                        <div className="flex flex-wrap items-center gap-4 text-slate-400">
                                            <motion.div 
                                                whileHover={{
                                                    color: "rgba(255,255,255,0.4)"
                                                }}
                                                onClick={() => navigate(`/company/${jobPost?.company?.company_id}`)} 
                                                className="cursor-pointer flex items-center gap-2"
                                            >
                                                <Building2 className="w-4 h-4" />
                                                <span>{jobPost?.company?.name}</span>
                                            </motion.div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{jobPost?.company?.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{getDaysAgo(jobPost.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Info Tags */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                                        <Briefcase className="w-4 h-4 text-purple-300" />
                                        <span className="text-sm text-purple-200 capitalize">{jobPost.employment_type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                        <MapPin className="w-4 h-4 text-blue-300" />
                                        <span className="text-sm text-blue-200 capitalize">{jobPost.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                                        <DollarSign className="w-4 h-4 text-green-300" />
                                        <span className="text-sm text-green-200">${jobPost.salary_start} - ${jobPost.salary_end}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                                        <Clock className="w-4 h-4 text-orange-300" />
                                        <span className="text-sm text-orange-200">{jobPost.experience} years exp</span>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    Job Description
                                </h2>
                                <p className="text-slate-300 leading-relaxed">{jobPost.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    Requirements
                                </h2>
                                <ul className="space-y-3">
                                    {jobPost.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-purple-300" />
                                            </div>
                                            <span className="text-slate-300">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Responsibilities */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    Responsibilities
                                </h2>
                                <ul className="space-y-3">
                                    {jobPost?.responsibilities.map((resp, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-pink-300" />
                                            </div>
                                            <span className="text-slate-300">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    Benefits & Perks
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jobPost.benefit.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-slate-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* About Company */}
                            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                                    About {jobPost.company.name}
                                </h2>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={jobPost.company.image} alt={jobPost.company.name} className="w-12 h-12 object-contain" />
                                    </div>
                                    <div>
                                        <motion.h3 
                                            whileHover={{
                                                color: "rgba(255,255,255,0.4)"
                                            }}
                                            transition={{ duration: 0.1, ease: "easeOut" }}
                                            onClick={() => navigate(`/company/${jobPost?.company?.company_id}`)} 
                                            className="cursor-pointer text-xl font-semibold mb-1"
                                        >
                                            {jobPost.company.name} <span className="text-xs">{" >"}</span>
                                            </motion.h3>
                                        <p className="text-purple-400 text-sm mb-2">{jobPost.company.industry}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed">{jobPost.company.description}</p>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Apply Card */}
                            <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                        ${jobPost.salary_start} - ${jobPost.salary_end}
                                    </div>
                                    <p className="text-slate-400 text-sm">per month</p>
                                </div>

                                <button
                                    onClick={() => handleApplyReq()}
                                    className="cursor-pointer w-full py-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all mb-3"
                                >
                                    Apply Now
                                </button>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                        <Mail className="w-4 h-4" />
                                        <span>Contact :</span>
                                    </div>
                                    <a
                                        href={`mailto:${jobPost.contact_email}`}
                                        className="text-purple-400 hover:text-purple-300 transition-colors break-all"
                                    >
                                        {jobPost.contact_email}
                                    </a>
                                </div>
                            </div>

                                {/* Job Info */}
                                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                                    <h3 className="text-lg font-bold mb-4">Job Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-slate-400 text-sm mb-1">Industry</div>
                                            <div className="font-medium">{jobPost.industry}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm mb-1">Employment Type</div>
                                            <div className="font-medium capitalize">{jobPost.employment_type}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm mb-1">Work Location</div>
                                            <div className="font-medium capitalize">{jobPost.location}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm mb-1">Experience Required</div>
                                            <div className="font-medium">{jobPost.experience} years</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-400 text-sm mb-1">Posted Date</div>
                                            <div className="font-medium">{jobPost.created_at}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Apply Modal */}
                {showApplyModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Apply for this job</h2>
                                <button
                                    onClick={() => setShowApplyModal(false)}
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                        <img src={jobPost.company.image} alt={jobPost.company.name} className="w-10 h-10 object-contain" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{jobPost.title}</div>
                                        <div className="text-sm text-slate-400">{jobPost.company.name}</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Expected Salary (per month)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            value={expectedSalary}
                                            onChange={(e) => setExpectedSalary(e.target.value)}
                                            placeholder="e.g., 7000"
                                            className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Salary range: ${jobPost.salary_start} - ${jobPost.salary_end}
                                    </p>
                                </div>

                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <p className="text-sm text-slate-300">
                                        <strong>Note:</strong> Your profile information and resume will be sent to the employer.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleApplyJob}
                                disabled={!expectedSalary}
                                className="cursor-pointer w-full py-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}