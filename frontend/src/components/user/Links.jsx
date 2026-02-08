import {Option, Title, PlusButton, InputTag, CancelButton, SaveButton, MoreMenu, AnchorTag} from "./utils/utils_config"//"@/components/user/utils/utils_config"
import { toast } from "react-toastify"
import { useState } from 'react';
import { Link as LinkIcon, Plus, X, Save, Globe, Linkedin, Github, Twitter, Briefcase, Mail as Email } from 'lucide-react';
import {updateUser, addUserData, deleteUserData} from "../../utils/fetch_data/fetch_config"//"@/util/fetchData/fetch_config"

const Links = ({session, token, setUser, user_id, Mail, setEditMode, editMode, email, links, handleRemoveLink, newLink, setNewLink, handleAddLink}) => {
    
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        type: 'Website'
    });

    const [errors, setErrors] = useState({});

    // Link types from your schema
    const linkTypes = [
        { value: 'Website', label: 'Website', icon: <Globe className="w-5 h-5" /> },
        { value: 'Linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
        { value: 'GitHub', label: 'GitHub', icon: <Github className="w-5 h-5" /> },
        { value: 'Twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5" /> },
        { value: 'Portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" /> },
        { value: 'Other', label: 'Other', icon: <LinkIcon className="w-5 h-5" /> },
        { value: 'Email', label: 'Email', icon: <Email className="w-5 h-5" /> }
    ];

    // Reset form
    const resetForm = (cancel=false) => {
        setFormData({
            url: '',
            type: 'Website'
        });
        setErrors({});
        if(cancel) {
            setIsAdding(false);
            setEditingId(null);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.url.trim()) {
            newErrors.url = 'URL is required';
        } else {
            // Check if URL starts with http:// or https://
            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(formData.url.trim())) {
                newErrors.url = 'URL must start with http:// or https://';
            }
        }

        // Check for duplicate URL (only when adding, not editing)
        if (!editingId) {
            const isDuplicate = links.some(
                link => link.url.toLowerCase() === formData.url.trim().toLowerCase()
            );
            if (isDuplicate) {
                newErrors.url = 'This URL already exists';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Add link
    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const response = await addUserData(
                user_id, 
                {
                    url: formData.url.trim(),
                    type: formData.type
                }, 
                "link",
                token
            );
            const data = await response.json()
            
            if(response.status === 201){
                const {link_id, type, url} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                    links: [...prevUser.links, {link_id, type, url}]
                }));
                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding link:', error);
            toast.error('Failed to add link');
        }
    };

    // Start editing
    const handleEdit = (link) => {
        setEditingId(link.link_id);
        setFormData({
            url: link.url,
            type: link.type
        });
        setIsAdding(false);
    };

    // Update link   (field, field_id,  reqBody)
    const handleUpdate = async (linkId) => {
        if (!validateForm()) return;

        try {
            const response = await updateUser(
                "link",
                linkId, 
                {
                    url: formData.url.trim(),
                    type: formData.type
                },
                token
            );
            const data = await response.json()

            if(response.status === 200){
                const {link_id, type, url} = data.data
                // update user state
                setUser(prevUser => ({
                    ...prevUser,
                    links: prevUser.links.map(link =>
                        link.link_id === linkId ? {link_id, type, url} : link
                    )
                }));
                resetForm();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error updating link:', error);
            toast.error('Failed to update link');
        }
    };

    // Delete link
    const handleDelete = async (linkId) => {
        if (!confirm('Are you sure you want to delete this link?')) return;

        try {
            const response =  await deleteUserData("link", linkId, token);
            const data = await response.json()

            if(response.status === 200){
                // update user state
                    setUser(prevUser => ({
                    ...prevUser,
                    links: prevUser.links.filter(link => link.link_id !== linkId)
                }));

                if (editingId === linkId) resetForm();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            toast.error('Failed to delete link');
        }
    };

    const handleClickPlus = () => {
        resetForm();
        setIsAdding(true);
        setEditingId(null);
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Contact & Links"/>
                {(token && session.user_id == user_id) && <PlusButton handleClick={handleClickPlus}/>}
            </div>

            {/* Editing/adding form */}
            {(isAdding || editingId) && (
                 <div className="mb-6 p-6 bg-white/5 rounded-xl border border-blue-500/30">
                    <div className="space-y-4">
                        {/* Link Type */}
                        <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Link Type *
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {linkTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                    className={`cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                                    formData.type === type.value
                                        ? 'bg-blue-500/30 border-blue-500/50 text-blue-200'
                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    {type.icon}
                                    <span className="text-sm hidden sm:inline">{type.label}</span>
                                </button>
                                ))}
                            </div>
                        </div>

                        {/* URL */}
                        <InputTag 
                            label="URL *"
                            type="url"
                            name="url"
                            value={formData.url}
                            handleChangeFunc={handleChange}
                            placeholder="https://example.com"
                            maxLength={255}
                            error={errors.url}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <CancelButton resetForm={() => resetForm(true)}/>

                        <SaveButton 
                            field="Link" 
                            handleSave={() => editingId ? handleUpdate(editingId) : handleAdd()}
                            editingId={editingId}
                        />
                    </div>
                </div>
            )}
            
            {/* Link list */}
            <div className="space-y-3">
                {/* Email Link */}
                <AnchorTag token={token} linkTypes={linkTypes} url={email} linkType={"Email"} status={{session, user_id}}/>

                {
                    links.map((link) => (
                    <AnchorTag 
                        key={link.link_id} 
                        onEdit={() => handleEdit(link)} 
                        onDelete={() => handleDelete(link.link_id)} 
                        url={link.url} 
                        linkType={link.type} 
                        status={{session, user_id}}
                        linkTypes={linkTypes}
                    />
                ))
            }
        </div>
    </div>
  );
}
export default Links