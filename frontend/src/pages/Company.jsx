import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams , useNavigate} from 'react-router-dom';
import Loading from "../components/Loading"
import { toast } from 'react-toastify';
import {Tabs, CompanyHeaders, JobPost, Member, JobApplicant} from "../components/company/company_config"
import {
	getOneCompany,  
	getJobPost, 
	getJobApplicantCompany, 
	getCompanyStats,
	getCompanyMember,
} from "../utils/fetch_data/fetch_config"


export default function CompanyDetailPage({setFetchCount}) {
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
	const [openInterviewModal, setOpenInterviewModal] = useState(null) //will store the applicant_id that to be schedule for interview

	const navigate = useNavigate()

	let {company_id} = useParams();
	company_id = parseInt(company_id)
	
	useEffect(() => {
        if (openModal || openInterviewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openModal, openInterviewModal]);


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

	// fetch latest unread notification count, whenever the data is changed
	useEffect(() => {
		if(token) setFetchCount(true)
	}, [company, jobs, applicants, members, stats, activeTab])


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

	// get all company member
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
						className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors mb-2"
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
							{token && isMember && <Tabs {...{setActiveTab, activeTab}} target="applicants" title="Applicants"/>}
							{token && isMember && <Tabs {...{setActiveTab, activeTab}} target="members" title="Members"/>}
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
				{isMember && activeTab === 'applicants' && (
					<JobApplicant {...{openInterviewModal, applicants,setApplicants,  token, setOpenInterviewModal, filterJob, setFilterJob, jobs, filterStatus, setFilterStatus, filteredApplicants}}/>
				)}

				{/* Members Tab */}
				{isMember && activeTab === 'members' && (
					<Member {...{token, company_id, members, company, session, setMembers}}/>
				)}
			</div>
		</div>
	);
}