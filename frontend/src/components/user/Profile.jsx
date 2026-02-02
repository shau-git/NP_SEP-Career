import {useState} from 'react'
import { toast } from "react-toastify"

import {updateUser} from "../../utils/fetch_data/fetch_config"//"@/util/fetchData/fetch_config"
import {EditButton, CldWidget} from "../../components/utils/utils_config"//"@/components/user/utils/utils_config"

const Profile = ({ session, token, user, user_id, setUser, Camera, MapPin, Briefcase, name, role}) => {
    const [nameDraft, setNameDraft] = useState('');
    const [roleDraft, setRoleDraft] = useState('');
    const [editMode, setEditMode] = useState(false);

    // Function to toggle editMode
    const handleEdit = () => {
        if(editMode === false) {
            // save user's name & role to a draft
            setNameDraft(name||"")
            setRoleDraft(role||"");
        } else {
            // clear draft
            setNameDraft('')
            setRoleDraft('');
        }
        // toggle edit mode
        setEditMode(prev => !prev);
    }

    const handleSave = async (reqBody, field) => {
        try {
            const response = await updateUser("user", user_id, reqBody, token);
            const data = await response.json()
            if(response.status === 200){
                // update user state
                setUser(prevUser => ({ ...prevUser, [field]: data.data[field]}));
                // clear edit mode
                toast.success(`${field} updated successfully`);
            } else {
                toast.error(`${field} update Failure`)
            }
            
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error(error);
        }
    }

    const handleSaveName = () => {
        handleSave({name: nameDraft}, "name")
    }

    const handleSaveRole = () => {
        handleSave({role: roleDraft}, "role")
    }

    return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto px-5 py-9">
                <div className="     bg-linear-to-r from-[rgba(102,126,234,0.2)]  to-[rgba(118,75,162,0.2)]     backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    {(token && session.user_id == user_id) && <div className="flex justify-end items-center">
                        <EditButton handleEdit={handleEdit}/>
                    </div>}
                    <div className="flex flex-col gap-7 items-center ">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="relative overflow-hidden w-36 h-36 rounded-full bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] flex items-center justify-center text-4xl font-bold text-white border-4 border-[rgba(102,126,234,0.5)]">
                                {user.image ? (
                                    <img src={user.image} alt={name} className="w-full h-full rounded-full object-cover" />
                                 ) : (
                                     <div>{name.split(' ').map(n => n[0]).join('')}</div>
                                )}
                            </div>

                            { (token && session.user_id == user_id ) && <CldWidget {...{setUser, token}}/>}
                        </div>

                        {/* Profile Info */}
                        {
                            editMode ? (
                                <>  
                                    {/*Edit name */}
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            value={nameDraft}
                                            onChange={(e) => setNameDraft(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white/90 focus:outline-none focus:border-purple-500"
                                            placeholder='John Doe'
                                        />
                            
                                        <button 
                                            onClick={handleSaveName}
                                            className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all text-[14px]"
                                        >
                                            Save
                                        </button>
                                    </div>

                                    {/*Edit Role */}
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            value={roleDraft}
                                            onChange={(e) => setRoleDraft(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white/90 focus:outline-none focus:border-purple-500"
                                            placeholder='John Doe'
                                        />
                            
                                        <button 
                                            onClick={handleSaveRole}
                                            className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all text-[14px]"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 text-center">
                                    <div className="flex items-center flex-wrap justify-center mb-1">
                                        <h1 className="text-3xl font-bold  text-[#667eea] mb-r">{user.name}</h1>
                                    </div>
                                    
                                    <p className="text-[15px] text-purple-300 mb-3">{user.role}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile