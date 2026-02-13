import {useState, useEffect} from 'react'
import {getUser, updateUser, addUserData, deleteUserData} from "../utils/fetch_data/fetch_config"
import { toast } from "react-toastify"
import { Edit2} from 'lucide-react';
import {Profile, Summary,  Education, Experience, Skill, Language, Links, Stats} from "../components/user/user_config"
import Loading from "../components/Loading"
import { useParams , useNavigate} from 'react-router-dom';

const User = ({setFetchCount}) => {
    let {user_id} = useParams();
	user_id = parseInt(user_id)

	const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [summaryDraft, setSummaryDraft] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [jobApp, setJobApp] = useState([])
    const [stats, setStats] = useState({totalApplicants:0 , pendingInterview:0, interview:0})

    const fetchUser = async () => {
        const response = await getUser(user_id, token)
        const data = await response.json();
        if(response.status === 200) {
            setUser(data.data)

            // count user stats
            const {job_applicants} = data.data
            if (job_applicants && job_applicants.length > 0) {
                const counts = job_applicants.reduce((acc, applicant) => {
                    if (applicant.status === 'PENDING') acc.pending += 1;
                    if (applicant.status === 'INTERVIEW') acc.pendingInterview += 1;
                    
                    return acc;
                }, { pendingInterview: 0, pending: 0 });

                setStats({totalApplicants: job_applicants.length, ...counts});
                setJobApp(job_applicants)
            }
        } else if (response.status === 404) {
            toast.error(data.message)
            return navigate('/')
        } else {
            toast.error(data.message)
        }
    }

    // to fetch the lates notification count whenever the data is changed
    useEffect(() => {
        if(token) setFetchCount(true)
    }, [user, newSkill, jobApp, stats])

    useEffect(() => {
		if(!user_id) {
            toast.error("User Id must be a number")
            return navigate('/')
        }
        setSession(JSON.parse(localStorage.getItem('user')))
        setToken(localStorage.getItem('token'))
        fetchUser()
    }, [])

    const [editMode, setEditMode] = useState({
        summary: false,
        skills: false,
        links: false
    });

    const [newLink, setNewLink] = useState({ type: "website", url: "", label: "" });

    const handleAddLink = () => {
        if (newLink.url.trim()) {
        const newLinkObj = {
            link_id: Date.now(),
            type: newLink.type,
            url: newLink.url.trim(),
            label: newLink.label.trim() || newLink.type,
            is_primary: false
        };
        setUser({ ...user, links: [...user.links, newLinkObj] });
        setNewLink({ type: "website", url: "", label: "" });
        }
    };

    const handleRemoveLink = (linkId) => {
        setUser({ ...user, links: user.links.filter(l => l.link_id !== linkId) });
    };


    if (!user) {
        return (
            <Loading/>
        )
    }

    const { name, image, role, email, summary, languages, links, experiences, educations, skills} = user

    // ===== SUMMARY FUNCTIONS =====  
    const handleEditSummary = () => {
        // save user's summary to a draft
        setSummaryDraft(summary||"");
        // set the summary (about me) to edit mode
        setEditMode({ ...editMode, summary: true });
    };

    const handleSaveSummary = async () => {
        try {
            const response = await updateUser("user", user_id, {summary: summaryDraft}, token);
            const data = await response.json()
            if(response.status === 200){
                // update user state
                setUser({ ...user, summary: data.data.summary});//summaryDraft
                // clear edit mode
                setEditMode({ ...editMode, summary: false });
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.error('Error updating summary:', error);
            toast.error(error);
        }
    };

    const handleCancelSummary = () => {
        // clear summary draft
        setSummaryDraft('');
        // change back to normal mode
        setEditMode({ ...editMode, summary: false });
    };


    // ===== SKILL FUNCTIONS ===== 
    const handleAddSkill = async () => {
        // if user add an empty thing dont execute 
        if (!newSkill.trim()) return;

        try {
            const response = await addUserData(user_id, {skill: newSkill.trim()}, "skills", token);
            const data = await response.json()

            if(response.status === 201){
                const {skill_id, skill} = data.data
                // update user state
                setUser({
                    ...user,
                    skills: [...user.skills, {skill_id, skill}]
                });
                // clear new skill draft
                setNewSkill('');
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }            
        } catch (error) {
            console.error('Error adding skill:', error);
            toast.error(error);
        }
    };

    const handleRemoveSkill = async (skill_id) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;

        try {
            const response =  await deleteUserData("skills", skill_id, token);
            const data = await response.json()

            if(response.status === 200){
                // update user state
                setUser({
                    ...user,
                    skills: skills.filter(s => s.skill_id !== skill_id)
                });
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }         

            
        } catch (error) {
            console.error('Error removing skill:', error);
            toast.error('Failed to remove skill');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f1e]">
            
            {/* Profile Header */}
            <Profile {...{ session, token, setUser, user, user_id,  name, image, role}}/>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Me */}
                        <Summary {...{session, token, user_id, setSummaryDraft, summary, handleEditSummary, handleSaveSummary,handleCancelSummary,  editMode, summaryDraft, Edit2}}/>
                        
                        {/* Experience */}
                        <Experience {...{ session, token, user_id, user, experiences, setUser }}/>
                        
                        {/* Education */}
                        <Education {...{session, token, educations, setUser, user_id }}/>

                        {/* Skills */}
                        <Skill {...{session, user_id, setEditMode, editMode, skills,  handleRemoveSkill, newSkill,  setNewSkill, handleAddSkill, token}}/>
                    </div>
                    

                    <div className="lg:col-span-1 space-y-6">
                        {/*Job Application stats */}
                        {token && session && session.user_id === user_id && <Stats {...{stats, jobApp}}/>}

                        {/* Contact & Links */}
                        <Links {...{session, token, setUser, user_id,  setEditMode, editMode, email, links,  handleRemoveLink, newLink, setNewLink, handleAddLink}}/>

                        {/* Languages */}
                        <Language {...{session, token, languages, setUser, user_id}}/>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default User