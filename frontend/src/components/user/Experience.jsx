import {useState} from 'react'
import {PlusButton, Title, Duration, MoreMenu , InputTag, SelectTag, CancelButton, SaveButton, Description, InputEndDate} from "../../components/utils/utils_config"//"@/components/user/utils/utils_config"
import { formatDate} from '../../utils/formatting'//'@/util/formating'
import {updateUser, addUserData, deleteUserData} from "../../utils/fetch_data/fetch_config"//"@/util/fetchData/fetch_config"
import { toast } from "react-toastify"

const Experience = ({ session, token, experiences, setUser, user_id}) => {

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        years: '0-2',
        start_date: '',
        end_date: '',
        employment_type: 'full time',
        description: ''
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            company: '',
            role: '',
            years: '0-2',
            start_date: '',
            end_date: '',
            employment_type: 'full time',
            description: ''
        });
        setErrors({});
        setIsAdding(false);
        setEditingId(null);
    };

    //handle save button
    const handleSaveButton = () => {
        editingId ? handleUpdate(editingId) : handleAdd()
    }

    // handle the plus button
    const handleClickPlus = () => {
        resetForm();
        setIsAdding(true);
        setEditingId(null);
        
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field
        if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
        }
    };


    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) newErrors.company = 'Company is required';
        else if (formData.company.length > 30) newErrors.company = 'Max 30 characters';

        if (!formData.role.trim()) newErrors.role = 'Role is required';
        else if (formData.role.length > 30) newErrors.role = 'Max 30 characters';

        if (!formData.start_date) newErrors.start_date = 'Start date is required';

        if (!formData.end_date) newErrors.end_date = 'End date is required';
        else if (formData.end_date !== 'present' && new Date(formData.end_date) < new Date(formData.start_date)) {
            newErrors.end_date = 'End date must be after start date';
        }

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length > 500) newErrors.description = 'Max 500 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update experience
    const handleUpdate = async (experienceId) => {
        if (!validateForm()) return;

        try {
            const response = await updateUser("experience", experienceId, formData, token);
            const data = await response.json()

            if(response.status === 200){
                const {experience_id, company, role, years, start_date, end_date, description, employment_type} = data.data
                // Update user state
                setUser(prevUser => {
                    return {
                        ...prevUser,
                        experiences: prevUser.experiences.map(exp =>
                            exp.experience_id === experienceId ? 
                                {experience_id, company, role, years, start_date, end_date, description, employment_type}
                            :    exp
                        )
                    }
            });
                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }   
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error('Failed to update experience');
        }
    };

    // Add experience
    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const response = await addUserData(user_id, formData, "experience", token);
            const data = await response.json()
            
            if(response.status === 201){
                const {experience_id, company, role, years, start_date, end_date, description, employment_type} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                    experiences: [
                        ...(prevUser.experiences || []), // Spreads existing items, or an empty array if undefined, 
                        {experience_id, company, role, years, start_date, end_date, description, employment_type}
                    ]
                }))
                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding experience:', error);
            toast.error('Failed to add experience')
        }
    };

    // Delete experience
    const handleDelete = async (experienceId) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;
    
        try {
            const response =  await deleteUserData("experience", experienceId, token);
            const data = await response.json()

            if(response.status === 200){
                // update user state
                setUser(prevUser => ({
                    ...prevUser,
                    experiences: prevUser.experiences.filter(exp => exp.experience_id !== experienceId)
                }));
            
                if (editingId === experienceId) resetForm();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }      
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience');
        }
    };

    // Start editing
    const handleEdit = (exp) => {
        setEditingId(exp.experience_id);
        setFormData({
            company: exp.company,
            role: exp.role,
            years: exp.years,
            start_date: exp.start_date.split('T')[0], // Format: YYYY-MM-DD
            end_date: exp.end_date === 'present' ? 'present' : exp.end_date.split('T')[0],
            employment_type: exp.employment_type,
            description: exp.description
        });
        setIsAdding(false);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Experience"/>

                {(session.user_id == user_id) && <PlusButton handleClick={handleClickPlus}/>}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="mb-6 p-6 bg-white/5 rounded-xl border border-purple-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company */}
                        <InputTag 
                            label="Company *"
                            type="text"
                            name="company"
                            value={formData.company}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Google"
                            maxLength={30}
                            error={errors.company}
                        />

                        {/* Role */}
                        <InputTag 
                            label="Role *"
                            type="text"
                            name="role"
                            value={formData.role}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Senior Developer"
                            maxLength={30}
                            error={errors.role}
                        />

                        {/* Years of Experience */}
                        <SelectTag 
                            field="Years of Experience *"
                            name="years"
                            value={formData.years}
                            handleChangeFunc={handleChange}
                            options={["0-2", "3-5", "5-8", "8+" ]}
                        />

                        {/* Employment Type */}
                        <SelectTag 
                            field="Employment Type *"
                            name="employment_type"
                            value={formData.employment_type}
                            handleChangeFunc={handleChange}
                            options={["full time", "part time"]}
                        />

                        {/* Start Date */}
                        <InputTag 
                            label="Start Date *"
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            handleChangeFunc={handleChange}
                            error={errors.start_date}
                        />

                        {/* End Date */}
                        <InputEndDate
                            handleChange={handleChange}
                            errors={errors}
                            formData={formData}
                            setFormData={setFormData}
                        />

                        {/* Description */}
                        <Description
                            value={formData.description}
                            handleChange={handleChange}
                            placeholder="Describe your role and achievements..."
                            maxLength={500}
                            rows={4}
                            errors={errors}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <CancelButton {...{resetForm}}/>

                        <SaveButton 
                            field="Experience" 
                            handleSave={handleSaveButton}
                            editingId={editingId}
                        />
                    </div>
                </div>
            )}
            

            {/* Experience List*/}
            <div className="space-y-6">
                {experiences.length === 0 ? (
                <p className="text-center text-white/50 py-8">No experience added yet</p>
                ) : (
                experiences.map((exp) => (
                    <div
                        key={exp.experience_id}
                        className="border-b border-white/10 pb-6 last:border-0 group"
                    >
                        <div className="flex gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] flex items-center justify-center text-2xl shrink-0">
                                🚀
                            </div>

                            {/* Experience data */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                                        <div className="text-[rgb(102,126,234)] font-semibold">{exp.company}</div>
                                        <div className="text-white/50 text-sm mb-3">
                                            {formatDate(exp.start_date)} - {formatDate(exp.end_date)} · {exp.years} years
                                        </div>
                                       
                                        <Duration design="bg-purple-500/20 border-purple-500/30 " duration={exp.employment_type}/>
                                    </div>

                                    {/* button to toogle edit & delete */}
                                    {
                                        (session.user_id == user_id) &&  
                                            <MoreMenu
                                                onEdit={() => handleEdit(exp)}
                                                onDelete={() => handleDelete(exp.experience_id)}
                                            />
                                    }
                                </div>
                                <p className="text-white/70 leading-relaxed">{exp.description}</p>
                            </div>
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
    )
}

export default Experience