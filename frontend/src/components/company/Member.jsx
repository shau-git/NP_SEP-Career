import {UserPlus} from "lucide-react"
import {MemberMoreMenu, SelectTag, CancelButton, SaveButton} from "./utils/company_util_config"
import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';
import { updateCompanyMember , getUser, createCompanyMember} from "../../utils/fetch_data/fetch_config";
import {X, Search, UserRound} from "lucide-react"
import {toast} from "react-toastify"

const Member = ({company_id, members, company, session, setMembers, token}) => {
    const [createModal, setCreateModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [searchUserId, setSearchUserId] = useState(null)
    const [searchingUser, setSearchingUser] = useState(false);
    const [searchedUser, setSearchedUser] = useState({})
    const [isCurrentMember, setIsCurrentMember] = useState('')
    const [formData, setFormData] = useState({
        role: "",
        status: ""
    });

    useEffect(() => {
        if (editingId || createModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [editingId, createModal]);


    // handle searching query
    useEffect(() => {
        // If the query is empty, hide the dropdown and don't fetch
        if (!searchUserId) {
            setSearchedUser({});
            setSearchingUser(false) // Reset loading
            return;
        }
        
        // Start loading immediately when user types
        setSearchingUser(true)

        // 1. Set a timer to wait 500ms after the last keystroke
        const delayDebounceFn = setTimeout(async () => {
            try {
                // 2. Fetch from backend using the name query param
                const response = await getUser(searchUserId);
                const data = await response.json();
                
                if (response.status === 200) {
                    const {user_id} = data.data
                    const isMember = members.find(member => member.user_id === user_id)
                    if(isMember && isMember.user_id) {
                        if(isMember.removed === true) {
                            setIsCurrentMember("Removed")
                        } else {
                            setIsCurrentMember("Added")
                        }
                    } else {
                        setIsCurrentMember('')
                    }
                    setSearchedUser(data.data);
                } else {
                    toast.error(data.message)
                    setSearchedUser({})
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setSearchingUser(false); // Stop loading regardless of outcome
            }
        }, 500);

        // 3. Cleanup function: clears the timer if the user types again within 500ms
        return () => clearTimeout(delayDebounceFn);
    }, [searchUserId])

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

    // function for close adding new member modal
    const handleCloseCreateModal = () => {
        setCreateModal(false);
        setSearchUserId(null);
        setSearchedUser({})
    };

    // function for adding new member
    const handleAddNewMember = async() => {
        try {
            const response = await createCompanyMember(company_id, {user_id: searchUserId, role: "member"}, token);
            const data = await response.json()
            if(response.status === 201){
                // Update user state
                setMembers(prevMembers => {
                    return ([
                        data.data,
                        ...prevMembers
                    ])
                })
                // clear draft
                toast.success(data.message);
            } else {
                console.log(data)
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('Failed to add member')
        }
    }

    return (
        <div>
            {/* Modal for editting member's data */}
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
                        <CancelButton handleCancel={() => handleCancel()}/>
                        <SaveButton handleSave={() => updateMember()} title="Confirm"/>
                    </div>
                </div>
            </div>}
            
            {/* modal for adding new member */}
            {
                createModal && <div className="fixed inset-0 bg-black/70  flex flex-col items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border-gray-100 rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Search User ID</h2>
                        <div className="relative">
                            <input
                                type="number"
                                value={searchUserId}
                                onChange={(e) => setSearchUserId(e.target.value)}
                                placeholder="Enter user ID (e.g., 1)"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            />
                            <Search className="w-5 h-5 absolute left-4 top-1/2 text-gray-400  transform -translate-y-1/2"/>
                            <X onClick={() => setSearchUserId('')} className="cursor-pointer w-5 h-5 absolute right-4 top-1/2 text-gray-400  transform -translate-y-1/2"/>
                        </div>

                        { searchUserId && (
                            <div className="mt-4 bg-gray-800 rounded-lg border border-gray-700">
                                {searchingUser ? (
                                    <div className="p-8 text-center text-gray-400">Searching...</div>
                                ) : searchedUser.user_id ? (
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 justify-start">
                                            {
                                                searchedUser.image ? (
                                                    <img src={searchedUser.image} className="w-10 h-10 " />
                                                ) :(
                                                    <div className="w-10 h-10 bg-white/10 rounded-full border-white/20 border flex items-center justify-center">
                                                        <UserRound className="w-5 h-5"/>
                                                    </div>
                                                )
                                            }
                                            
                                            <div className="flex flex-col">
                                                <div>
                                                    <span>{searchedUser.name}</span>
                                                    <span className="text-gray-500 ml-1">(ID: {searchedUser.user_id})</span>
                                                </div>
                                                <span className="text-gray-500 text-[14px]">{searchedUser.email}</span>
                                            </div>
                                        </div>
                                        {
                                            isCurrentMember? (
                                                <div className="px-2.5 py-1 bg-gray-500/60 text-white rounded-lg text-[12.5px]">
                                                    {isCurrentMember}
                                                </div>
                                            ) : (
                                                <SaveButton handleSave={() => handleAddNewMember()} title="Add"/>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        User ID {searchUserId} not found!
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <CancelButton handleCancel={() => handleCloseCreateModal()}/>
                        </div>
                    </div>
                </div>
            }
            
            {/* Title & Invite member button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Team Members</h2>
                {token && (company.role === 'owner' || company.role === 'admin') && (
                <button 
                    onClick={() => setCreateModal(true)}
                    className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
                 )}
            </div>

            {/* Display Company member list */}
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
                            {/* prevent  UI from showing "management" buttons  to a person looking at their own row.*/}
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