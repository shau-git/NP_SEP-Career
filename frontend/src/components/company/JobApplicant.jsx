import {DollarSign, Calendar, Clock, Eye} from 'lucide-react'
import {ApplicantMoreMenu} from "./utils/company_util_config"
import { Link } from 'react-router-dom';
import {updateApplicant} from "../../utils/fetch_data/fetch_config"
import {toast} from "react-toastify"
import {useState} from "react"

// token, setOpenInterviewModal, filterJob, setFilterJob, jobs, filterStatus, setFilterStatus, filteredApplicants, handleStatusChange, isMember
// token, filterJob setFilterJob, jobs, filterStatus, setFilterStatus, filteredApplicants,
const JobApplicant = ({openInterviewModal, applicants,setApplicants,  token, setOpenInterviewModal, filterJob, setFilterJob, jobs, filterStatus, setFilterStatus, filteredApplicants}) => {
    const [errors, setErrors] = useState({});
    const [interviewDraft, setInterviewDraft] = useState({
		interview_date: '',
		// interview_time: ''
	});

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

    // Validate form
    const validateForm = () => {
        const newErrors = {}
        
        if (!interviewDraft.interview_date) newErrors.interview_date = 'Interview date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // when user submit an interview date
	const handleSubmiInterview = (openInterviewModal) => {
		const reqBody = {status: "INTERVIEW", interview_date: interviewDraft.interview_date}
		if (!validateForm()) return		
		handleStatusChange(openInterviewModal, reqBody)
		setErrors({})
	}

    // Handle interview input change
    const handleChange = (field, value) => {
        setInterviewDraft(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
        setInterviewDraft(prev => ({ ...prev, [field]: null }));
        }
    };

    // update applicant status
	const handleStatusChange = async (applicantId, reqBody) => {
		if (!confirm(`Are you sure you want to change the status to ${reqBody.status}?`)) return;
		const response = await updateApplicant(applicantId, reqBody, token)
		const data = await response.json();
		if(response.status === 200) {
			const {interview_date, status} = data.data
			setApplicants(applicants.map(app => 
				app.applicant_id === applicantId ? { ...app, interview_date, status } : app
			));
			if(openInterviewModal) setOpenInterviewModal(null)
			toast.success(data.message)
		} else {
			toast.error(data.message)
		}
	};

    

    return (
        <div>
            { openInterviewModal && 
				<div className="fixed inset-0 bg-black/70  flex items-center justify-center p-4 z-50">
					<div className="bg-gray-900 border-gray-100 rounded-lg p-6 w-full max-w-sm">
						<h2 className="text-lg font-bold mb-4">Schedule Interview</h2>
						<InputTag 
							title="Date" 
							type="date"
							value={interviewDraft.interview_date} 
							handleChange={(e) => handleChange('interview_date', e.target.value)}
							errors={errors.interview_date} 
						/>

						<div className="flex justify-end gap-2 pt-2">
							<button  onClick={() => { setOpenInterviewModal(false); setErrors({})}} className="cursor-pointer px-4 py-2 text-gray-300 bg-gray-600/60 rounded">
								Cancel
							</button>
							<button  
								onClick={() => handleSubmiInterview(openInterviewModal)}
								className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
							>
								Confirm
							</button>
						</div>

					</div>
				</div>
			}
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