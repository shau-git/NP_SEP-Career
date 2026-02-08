import {useState, useEffect} from 'react'
import {PlusButton, Title, Duration, InputTag, SelectTag, CancelButton, SaveButton, Description, MoreMenu, InputEndDate} from  "./utils/utils_config"//"@/components/user/utils/utils_config"
import { formatDate} from '../../utils/formatting'//'@/util/formating'
import {updateUser, addUserData, deleteUserData} from "../../utils/fetch_data/fetch_config"//"@/util/fetchData/fetch_config"
import {Briefcase, Trash2, Edit2, X, Save, MoreVertical} from "lucide-react"
import { toast } from "react-toastify"

const Education = ({session, token, educations, setUser, user_id}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        institution: '',
        field_of_study: '',
        qualification: 'Primary School',
        start_date: '',
        end_date: '',
        study_type: 'full time',
        description: ''
    });

    const qualificationOptions = [
        'Primary School',
        'Secondary School',
        'ITE / Nitec',
        'A Level',
        'Diploma',
        'Degree',
        'Master',
        'PhD'
    ];

    // Reset form
    const resetForm = () => {
        setFormData({
            institution: '',
            field_of_study: '',
            qualification: 'Primary School',
            start_date: '',
            end_date: '',
            study_type: 'full time',
            description: ''
        });
        setErrors({});
        setIsAdding(false);
        setEditingId(null);
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

        if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
        else if (formData.institution.length > 50) newErrors.institution = 'Max 50 characters';

        if (!formData.field_of_study.trim()) newErrors.field_of_study = 'Field of study is required';
        else if (formData.field_of_study.length > 30) newErrors.field_of_study = 'Max 30 characters';

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

    // Add education
    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const response = await addUserData(user_id, formData, "education", token);
            const data = await response.json()

            if(response.status === 201){
                const {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                        educations: [...prevUser.educations, {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description}]
                }));

                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding education:', error);
            toast.error('Failed to add education');
        }
    };

    // Update education
    const handleUpdate = async (educationId) => {
        if (!validateForm()) return;

        try {
            const response = await updateUser("education", educationId, formData, token);
            const data = await response.json()

            if(response.status === 200){
                const {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                    educations: prevUser.educations.map(edu =>
                    edu.education_id === educationId ? 
                        {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description}
                    :   edu
                    )
                }));

                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }  
        } catch (error) {
            console.error('Error updating education:', error);
            alert(error.message || 'Failed to update education');
        }
    };

    // Delete education
    const handleDelete = async (educationId) => {
        if (!confirm('Are you sure you want to delete this education record?')) return;

        try {
            const response =  await deleteUserData("education", educationId, token);
            const data = await response.json()

            if(response.status === 200){
                // update user state
               setUser(prevUser => ({
                    ...prevUser,
                    educations: prevUser.educations.filter(edu => edu.education_id !== educationId)
                }));

                if (editingId === educationId) resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }      
        } catch (error) {
            console.error('Error deleting education:', error);
            toast.error(error.message || 'Failed to delete education');
        }
    };

    // Start editing
    const handleEdit = (edu) => {
        setEditingId(edu.education_id);
        setFormData({
            institution: edu.institution,
            field_of_study: edu.field_of_study,
            qualification: edu.qualification,
            start_date: edu.start_date.split('T')[0],
            end_date: edu.end_date === 'present' ? 'present' : edu.end_date.split('T')[0],
            study_type: edu.study_type,
            description: edu.description
        });
        setIsAdding(false);
    };

    const handleSaveButton = () => {
        editingId ? handleUpdate(editingId) : handleAdd()
    }

    const handleClickAdd = () => {
        resetForm();
        setIsAdding(true);
        setEditingId(null);
    }
 
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Education"/>
                
                {(token && session.user_id == user_id) &&  <PlusButton handleClick={handleClickAdd}/>}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="mb-6 p-6 bg-white/5 rounded-xl border border-pink-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Institution */}
                        
                        <InputTag 
                            label="Institution *"
                            type="text"
                            name="institution"
                            value={formData.institution}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Stanford University"
                            maxLength={50}
                            error={errors.institution}
                        />


                        {/* Field of Study */}
                        <InputTag 
                            label="Field of Study *"
                            type="text"
                            name="field_of_study"
                            value={formData.field_of_study}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Computer Science"
                            maxLength={30}
                            error={errors.field_of_study}
                        />


                        {/* Qualification */}
                        <SelectTag 
                            field="Qualification *"
                            name="qualification"
                            value={formData.qualification}
                            handleChangeFunc={handleChange}
                            options={qualificationOptions}
                        />

                        {/* Study Type */}
                        <SelectTag 
                            field="Study Type *"
                            name="study_type"
                            value={formData.study_type}
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
                            placeholder="Describe your studies, achievements, courses..."
                            maxLength={500}
                            rows={3}
                            errors={errors}
                        />
                    </div>


                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <CancelButton {...{resetForm}}/>

                        <SaveButton 
                            field="Education" 
                            handleSave={handleSaveButton}
                            editingId={editingId}
                        />
                    </div>
                </div>
            )}
            
            {/* Education List */}
             <div className="space-y-6">
                {educations.length === 0 ? (
                    <p className="text-center text-white/50 py-8">No education records added yet</p>
                    ) : (
                    educations.map((edu) => (
                        <div
                            key={edu.education_id}
                            className="border-b border-white/10 pb-6 last:border-0 group"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgb(240,147,251)] to-[rgb(245,87,108)] flex items-center justify-center text-2xl shrink-0">
                                    🎓
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">{edu.qualification}</h3>
                                            <div className="text-[rgb(240,147,251)] font-semibold mb-1">{edu.institution}</div>
                                            <div className="text-white/70 text-sm mb-2">{edu.field_of_study}</div>
                                            <div className="text-white/50 text-sm mb-3">
                                                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                            </div>
                                            <Duration design="bg-pink-500/20 border-pink-500/30" duration={edu.study_type}/>
                                        </div>

                                       
                                        {/* MoreMenu Component ( the 3 dot), only appear after creeting education record*/}
                                        {
                                            (token && session.user_id == user_id) &&  
                                            <MoreMenu
                                                onEdit={() => handleEdit(edu)}
                                                onDelete={() => handleDelete(edu.education_id)}
                                            />
                                        }
                                        
                                    </div>
                                    <p className="text-white/70 leading-relaxed">{edu.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Education