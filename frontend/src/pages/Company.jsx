import { useState, useEffect } from 'react';
import { 
	Building2, Users, Briefcase, UserPlus, Plus, Edit2, Trash2, 
	MoreVertical, CheckCircle, XCircle, Clock, Eye, Settings, ArrowLeft,
	Mail, MapPin, Calendar, DollarSign, Filter
} from 'lucide-react';
import { useParams , useNavigate} from 'react-router-dom';
import Loading from "../components/Loading"
import { toast } from 'react-toastify';
import {Tabs, CompanyHeaders, JobPost, Member} from "../components/company/company_config"
import {
	getOneCompany,  
	getJobPost, 
	getJobApplicantCompany, 
	getCompanyStats,
	getCompanyMember,
    updateCompanyMember,
    createCompanyMember,
} from "../utils/fetch_data/fetch_config"


export default function CompanyDetailPage() {
	const [session, setSession] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
	const [activeTab, setActiveTab] = useState('jobs'); // jobs, applicants, members
	const [company, setCompany] = useState({});
	const [jobs, setJobs] = useState([]);
	const [applicants, setApplicants] = useState([]);
	const [members, setMembers] = useState([]);
	const [companyLoading, setCompanyLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState('all');
	const [filterJob, setFilterJob] = useState('all');
	const [isMember, setIsMember] = useState(false)
	const [stats, setStats] = useState(null);
  	const [statsLoading, setStatsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false)
	const navigate = useNavigate()

	let {company_id} = useParams();
	company_id = parseInt(company_id)

	useEffect(() => {
        if (openModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openModal]);


	// get user payload and token
	useEffect(() => {
		if(!company_id) {
			toast.error("Company Id must be a number")
			return navigate('/')
		}
		const session = JSON.parse(localStorage.getItem('user'))
		const token = localStorage.getItem('token')

		const initialize = async () => {
			if(session && token) {
				setSession(session)
				setToken(token)

				// check if the user is the company member 
				const response = await getCompanyMember(company_id, token, session.user_id)
				const data = await response.json()

				if(response.status === 200) {
					setIsMember(true)
					setCompany(prev => ({...prev, role: data.data[0].role}))	
				} 
			}
			fetchCompanyData()
		}
		initialize()
	}, [])


	// handle toggle
	useEffect(() => {
		if (activeTab === 'jobs') fetchJobs();
		else if (activeTab === 'applicants') fetchApplicants();
		else if (activeTab === 'members') fetchMembers();
	}, [activeTab]);


	// get company stats
	useEffect(() => {
		const getStats = async() => {
			if(isMember) {
				setStatsLoading(true)
				const response = await getCompanyStats(company_id, token)
				const data = await response.json()
				if (response.status === 200) {
					setStats(data.data)
					setStatsLoading(false)
				} else {
					console.log(response)
				}
			}
		}
		getStats()
	},[isMember])

	// function to fetch compant data
	const fetchCompanyData = async () => {
		// GET /api/company/:companyId
		const response = await getOneCompany(company_id, token)
		const data = await response.json();
		if(response.status === 200) {
			setCompany(prev => ({
				...prev,
				...data.data,
			}))
		} else if (response.status === 404) {
			toast.error(data.message)
			// user visit an company page that the company_id is not found
			return navigate('/')
		} else {
			toast.error(data.message)
		}
		setCompanyLoading(false);
	};

	const fetchJobs = async () => {
		// GET /api/company/:companyId/jobs
		const response = await getJobPost(`company_id=${company_id}`, token)
		const data = await response.json();
		if(response.status === 200) {
			setJobs(data.data)
		} else {
			toast.error(data.message)
		}
	};

	const fetchApplicants = async () => {
		// GET /api/company/:companyId/jobapplicant
		const response = await getJobApplicantCompany(company_id,token)
		const data = await response.json();
		
		if(response.status === 200) {
			setApplicants(data.data)
		} else {
			toast.error(data.message)
		}
	};

	const fetchMembers = async () => {
		// GET /api/company/:companyId/members
		const response = await getCompanyMember(company_id, token)
		const data = await response.json();
		if(response.status === 200) {
			setMembers(data.data)
		} else {
			toast.error(data.message)
		}
	};

	const handleStatusChange = async (applicantId, newStatus) => {
		// PUT /api/applicants/:applicantId
		console.log('Update applicant', applicantId, 'to', newStatus);
		setApplicants(applicants.map(app => 
			app.applicant_id === applicantId ? { ...app, status: newStatus } : app
		));
		alert(`Applicant status updated to ${newStatus}`);
	};

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

	const filteredApplicants = applicants.filter(app => {
		if (filterStatus !== 'all' && app.status !== filterStatus) return false;
		if (filterJob !== 'all' && app.job_post.title !== filterJob) return false;
		return true;
	});


	if (companyLoading) {
		return (
		 	<Loading/>
		);
	}

  	return (
    	<div className="min-h-screen bg-slate-950 text-white pt-10">
			{/* Header */}
			<div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 px-5 py-9">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<button 
						onClick={() => navigate(-1)}
						className="p-2 hover:bg-white/10 rounded-lg transition-colors mb-2"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<CompanyHeaders {...{session, token, company_id, company, setCompany, isMember, stats, statsLoading}}/>
				</div>
			</div>

			{/* Tabs */}
			<div className={`bg-slate-900 border-b border-white/10 ${!openModal && "sticky" } top-20 z-1`}>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex gap-1">
							<Tabs {...{setActiveTab, activeTab}} target="jobs" title="Job Posts"/>
							{isMember && <Tabs {...{setActiveTab, activeTab}} target="applicants" title="Applicants"/>}
							{isMember && <Tabs {...{setActiveTab, activeTab}} target="members" title="Members"/>}
					</div>
				</div>
			</div>

      		{/* Content */}
      		<div className="max-w-7xl mx-auto px-6 py-8">
        		{/* Jobs Tab */}
        		{activeTab === 'jobs' && (
					<JobPost {...{jobs, company, setJobs, setOpenModal, token, isMember}}/>
				)}

				{/* Applicants Tab */}
				{activeTab === 'applicants' && (
				<div>
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
						<h2 className="text-xl lg:text-2xl font-bold">Applicants</h2>
						<div className="w-full sm:w-auto flex gap-2">
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
											<h3 className="text-base lg:text-lg font-semibold truncate">{applicant.user.name}</h3>
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
									{(company.userRole === 'owner' || company.userRole === 'admin') && applicant.status === 'PENDING' && (
									<div className="flex lg:flex-col gap-2">
										<button
											onClick={() => handleStatusChange(applicant.applicant_id, 'INTERVIEW')}
											className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
										>
											Interview
										</button>
										<button
											onClick={() => handleStatusChange(applicant.applicant_id, 'ACCEPTED')}
											className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
										>
											Accept
										</button>
										<button
											onClick={() => handleStatusChange(applicant.applicant_id, 'REJECTED')}
											className="flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
										>
											Reject
										</button>
									</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Members Tab */}
			{activeTab === 'members' && (
				<Member {...{members, company, session}}/>
			)}
      	</div>
    </div>
  );
}