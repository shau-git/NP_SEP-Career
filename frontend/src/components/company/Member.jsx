import {UserPlus} from "lucide-react"
import {MemberMoreMenu, SelectTag} from "./utils/company_util_config"
import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';
import { updateCompanyMember } from "../../utils/fetch_data/fetch_config";
import {toast} from "react-toastify"

const Member = ({company_id, members, company, session, setMembers, token}) => {
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        role: "",
        status: ""
    });

    useEffect(() => {
        if (editingId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [editingId]);

    // function to update member's data
    const updateMember = async () => {
        const reqBody = {role: formData.role}
        
        if(formData.status === "Add") {
            reqBody.removed = false
        } else {
            reqBody.removed = true
        }
        const response = await updateCompanyMember(company_id, reqBody, token, editingId)
		const data = await response.json();
    
        if(response.ok) {
            const {role, removed} = data.data
            setMembers(members.map(m => 
                m.company_member_id === editingId ? { ...m, role, removed } : m
            ));
            handleCancel()
            toast.success(data.message)
        } else {
            console.log(data.message)
            toast.error(data.message)
        }
    }

    // when admin/onwer choose to modify member's data
    const handleEdit = (member) => {
        setEditingId(member.company_member_id);
        setFormData({
            role: member.role,
            status: member.removed === false? "Add" : "Removed",
        })
    }

    // function when chaning from the modal's dropwdown list
    const handleChange = (field, value) => {
        console.log(editingId)
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // when admin/onwer want to cancel editing
    const handleCancel = () => {
        setFormData({
            role: "",
            status: ""
        })
        setEditingId(null)
    }

    // badge design for the role
    const getRoleBadge = (role) => {
		const styles = {
		owner: 'bg-purple-500/20 border-purple-500/30 text-purple-200',
		admin: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
		member: 'bg-gray-500/20 border-gray-500/30 text-gray-200'
		};
		return styles[role] || styles.member;
	};

    return (
        <div>
            
            {editingId && <div className="fixed inset-0 bg-black/70  flex items-center justify-center p-4 z-50">
                <div className="bg-gray-900 border-gray-100 rounded-lg p-6 w-full max-w-sm">
                    <h2 className="text-lg font-bold mb-4">Change Member's data</h2>
                    <SelectTag 
                        title="Role"
                        value={formData.role}
                        handleChange={(e) => handleChange('role', e.target.value)}
                        options={["owner", "admin", "member"]}
                        errors={null}
                    />
                    <SelectTag 
                        title="Status"
                        value={formData.status}
                        handleChange={(e) => handleChange('status', e.target.value)}
                        options={["Add", "Removed"]}
                        errors={null}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => handleCancel()}  className="cursor-pointer px-4 py-2 text-gray-300 bg-gray-600/60 rounded">
                            Cancel
                        </button>
                        <button  
                            onClick={() => updateMember()}
                            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>}
            
            

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Team Members</h2>
                {token && (company.role === 'owner' || company.role === 'admin') && (
                <button className="cursor-ppointer w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
                 )}
            </div>

            <div className="grid gap-3 lg:gap-4">
                {members.map(member => (
                    <div key={member.company_member_id} className="bg-white/5 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                                <img src={member.user.image} alt={member.user.name} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <Link 
                                        to={`/user/${member.user_id}`}
                                        target="_blank"
                                        className="text-base lg:text-lg font-semibold truncate"
                                    >
                                        {member.user.name}
                                    </Link>
                                    <p className="text-white/60 text-xs lg:text-sm truncate">{member.user.email}</p>
                                </div>
                                {
                                    member.removed === true && 
                                    <span className={`px-2 lg:px-3 py-1 border rounded-full text-xs capitalize shrink-0 bg-red-500/20 border-red-500/30 text-red-200`}>
                                        Removed
                                    </span>
                                }
                                <span className={`px-2 lg:px-3 py-1 border rounded-full text-xs capitalize shrink-0 ${getRoleBadge(member.role)}`}>
                                    {member.role}
                                </span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
    
                            {/* 1. ADMIN & OWNER ACTIONS: Change Role / Remove Member */}
                            {/* member.user_id !== session.user_id to prevent  UI from showing "management" buttons  to a person looking at their own row.*/}
                            {token && ((company.role === 'owner' ) || 
                                (company.role === 'admin' && member.role !== 'owner' && member.user_id !== session.user_id)) && (
                                    <MemberMoreMenu {...{ member, handleEdit}}/>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Member