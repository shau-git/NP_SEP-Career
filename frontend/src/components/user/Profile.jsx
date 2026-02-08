import {useState} from 'react'
import { toast } from "react-toastify"
import {SaveButton} from "../company/utils/company_util_config"
import {updateUser} from "../../utils/fetch_data/fetch_config"
import {EditButton, CldWidget, ProfileImage} from "./utils/utils_config"

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

                // update the user's name in the localstorage's payload
                const payload = JSON.parse(localStorage.getItem('user'))
                localStorage.setItem('user', JSON.stringify({...payload, name: data.data.name}))
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

    const changeImage = (image) => {
        setUser(prev => ({ ...prev, image }));
    }

    return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto px-5 py-9">
                <div className="bg-linear-to-r from-[rgba(102,126,234,0.2)]  to-[rgba(118,75,162,0.2)]  backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    {(token && session.user_id == user_id) && <div className="flex justify-end items-center">
                        <EditButton handleEdit={handleEdit}/>
                    </div>}
                    <div className="flex flex-col gap-7 items-center ">
                        {/* Profile Image */}
                        <ProfileImage show={(token && session.user_id == user_id)? true : false} data={user} tableName="user" {...{changeImage, token}}/>

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
                                        <SaveButton handleSave={handleSaveName}/>
                                    </div>

                                    {/*Edit Role */}
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            value={roleDraft}
                                            onChange={(e) => setRoleDraft(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white/90 focus:outline-none focus:border-purple-500"
                                            placeholder='John Doe'
                                        />
                                        <SaveButton handleSave={handleSaveRole}/>
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