import {DollarSign, Calendar, Clock, Eye} from 'lucide-react'
import {ApplicantMoreMenu} from "./utils/company_util_config"
import { Link } from 'react-router-dom';

const JobApplicant = ({token, setOpenInterviewModal, filterJob, setFilterJob, jobs, filterStatus, setFilterStatus, filteredApplicants, handleStatusChange, isMember}) => {

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

    return (
        <div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Applicants</h2>
                <div className="w-full sm:w-auto flex gap-2">
                    {/* Drop down list for Job */}
                    <select
                        value={filterJob}
                        onChange={(e) => setFilterJob(e.target.value)}
                        className="w-full focus:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                    <option value="all">All Jobs</option>
                        {jobs.map(job => (
                            <option key={job.job_post_id} value={job.title}>{job.title}</option>
                        ))}
                    </select>
                    {/* Drop down list for job applicant status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full focus:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-3 lg:gap-4">
                {filteredApplicants.map(applicant => (
                    <div key={applicant.applicant_id} className="bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/10">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex gap-3 lg:gap-4 flex-1 min-w-0">
                                <img src={applicant.user.image} alt={applicant.user.name} className="w-12 h-12 lg:w-16 lg:h-16 rounded-full shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <Link 
                                        to={`/user/${applicant.user_id}`}
                                        target="_blank"
                                        className="text-base lg:text-lg font-semibold truncate"
                                    >
                                            {applicant.user.name}
                                    </Link>
                                    <p className="text-white/60 text-xs lg:text-sm mb-2 truncate">{applicant.user.email}</p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`px-2 lg:px-3 py-1 border rounded-full text-xs ${getStatusBadge(applicant.status)}`}>
                                            {applicant.status}
                                        </span>
                                        <span className="px-2 lg:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 truncate max-w-50">
                                            {applicant.job_post.title}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs lg:text-sm">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <DollarSign className="w-3 lg:w-4 h-3 lg:h-4" />
                                            Expected: ${applicant.expected_salary}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60">
                                            <Calendar className="w-3 lg:w-4 h-3 lg:h-4" />
                                            Applied: {new Date(applicant.applied_date).toLocaleDateString()}
                                        </div>
                                        {applicant.interview_date && (
                                            <div className="flex items-center gap-2 text-blue-300">
                                                <Clock className="w-3 lg:w-4 h-3 lg:h-4" />
                                                Interview: {new Date(applicant.interview_date).toLocaleDateString()} {applicant.interview_time}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {token && 
                            <ApplicantMoreMenu {...{handleStatusChange, applicant, setOpenInterviewModal}}/>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default JobApplicant