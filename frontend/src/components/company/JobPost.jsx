import {useState, useEffect} from 'react'
import {getDaysAgo, formatEmploymentType, formatSalary} from "../../utils/formatting"
import { 
	Users,  Plus, Edit2, Trash2, Eye, Calendar,  MapPin , Clock, X
} from 'lucide-react';
import {Badge, InputTag, SelectTag, TextAreaTag, ListTag, TextList, PlusButton} from "./utils/company_util_config"
import { Link } from 'react-router-dom';
import {MoreMenu} from "./utils/company_util_config"
import {updateJobPost, createJobPost} from "../../utils/fetch_data/fetch_config"
import {toast} from "react-toastify"

const JobPost = ({jobs, company, setJobs, setOpenModal, token, isMember}) => {
	const [filterJobPost, setFilterJobPost] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        industry: "IT & Technology",
        employment_type: "full time",
        experience: "0-2",
        salary_start: "",
        salary_end: "",
        location: "onsite",
        summary: "",
        description: "",
        contact_email: "",
        requirements: [],
        responsibilities: [],
        benefit: []
    });
    
    const [errors, setErrors] = useState({});

    
    const handleEdit = (job) => {
        setEditingId(job.job_post_id);
        setFormData({
            title: job.title,
            industry: job.industry,
            employment_type: job.employment_type,
            experience: job.experience,
            salary_start: job.salary_start,
            salary_end: job.salary_end,
            location: job.location,
            summary: job.summary,
            description: job.description,
            contact_email: job.contact_email,
            requirements: [...job.requirements],
            responsibilities: [...job.responsibilities],
            benefit: [...job.benefit]
        })
        setIsAdding(false);
        setOpenModal(true)
    }

     
    // Industry options
    const industries = [
        'IT & Technology',
        'Healthcare',
        'Finance & Business',
        'F&B (Food & Bev)',
        'Creative & Media',
        'Education',
        'Engineering',
        'Retail & Sales',
        'Logistics & Trades'
    ];

    const experienceLevels = ['0-2', '2-5', '5-8', '8+'];
    const employmentTypes = ['full time', 'part time'];
    const locations = ['onsite', 'remote'];

    // filter job post to removed or active
    const filteredJobPost = jobs.filter(job => {
        if(filterJobPost === "all") {
            return true
        } else if (filterJobPost === "active") {
            return job.removed === false
        } else if (filterJobPost === "removed") {
            return job.removed === true
        }
	});

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            industry: "IT & Technology",
            employment_type: "full time",
            experience: "0-2",
            salary_start: "",
            salary_end: "",
            location: "onsite",
            summary: "",
            description: "",
            contact_email: "",
            requirements: [],
            responsibilities: [],
            benefit: []
        })
        setErrors({});
        setIsAdding(false);
        setEditingId(null);
        setOpenModal(false)
    };

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // set job post to removed
    const handleDelete = async(job_post_id) => {
        if (!confirm('Are you sure you want to remove this job post?')) return;
        handleUpdate(job_post_id, true, true)
    }

    // set the job post back from removed
    const handleRestore = async (job_post_id) => {
        if (!confirm('Are you sure you want to restore this job post?')) return;
        handleUpdate(job_post_id, true, false)
    }

    // update job post to remove
    const handleUpdate = async (job_post_id, setState = false, removed) => {
        try {
            let reqBody = formData;
            if(setState) reqBody = {removed}

            const response =  await updateJobPost(company.company_id, job_post_id, token, reqBody);
            const data = await response.json()

            if(response.status === 200){
                // update user state
                setJobs(prevJobs => (
                    prevJobs.map(job =>
                        job.job_post_id === job_post_id ? 
                            data.data
                        :    job
                    )
                ));
            
                toast.success(data.message)
                resetForm()
            } else {
                toast.error(data.message)
            }      
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience');
        }
    };

    const addJobPost = async () => {
        try {
            const response = await createJobPost(company.company_id, token, formData);
            const data = await response.json()
            if(response.status === 201){
                const {
                    job_post_id,
                    company_id, 
                    title,
                    industry,
                    requirements,
                    responsibilities,
                    employment_type,
                    experience,
                    created_at,
                    removed,
                    salary_start,
                    salary_end,
                    location,
                    benefit,
                    summary,
                    description
                } = data.data
                // Update user state
                setJobs(prevJob =>{
                    return ([
                        {job_post_id, company_id, title, industry, requirements, responsibilities, employment_type, experience,created_at,removed, salary_start, salary_end, location, benefit, summary, description},
                        ...prevJob
                    ])
                })
                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                console.log(data)
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding experience:', error);
            toast.error('Failed to add experience')
        }
    }

    // Array field handlers
    const handleArrayAdd = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), '']
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleArrayRemove = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 50) {
            newErrors.title = 'Title cannot exceed 50 characters';
        }

        if (!formData.industry) {
            newErrors.industry = 'Industry is required';
        }

        if (!formData.employment_type) {
            newErrors.employment_type = 'Employment type is required';
        }

        if (!formData.experience) {
            newErrors.experience = 'Experience level is required';
        }

        if (!formData.salary_start || formData.salary_start < 1) {
            newErrors.salary_start = 'Starting salary must be at least 1';
        }

        if (!formData.salary_end) {
            newErrors.salary_end = 'Ending salary is required';
        } else if (formData.salary_end <= formData.salary_start) {
            newErrors.salary_end = 'Ending salary must be greater than starting salary';
        }

        if (!formData.location) {
            newErrors.location = 'Location is required';
        }

        if (!formData.summary?.trim()) {
            newErrors.summary = 'Summary is required';
        } else if (formData.summary.length > 500) {
            newErrors.summary = 'Summary cannot exceed 500 characters';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Description cannot exceed 500 characters';
        }

        if (!formData.requirements?.length) {
            newErrors.requirements = 'At least one requirement is needed';
        }

        if (!formData.responsibilities?.length) {
            newErrors.responsibilities = 'At least one responsibility is needed';
        }

        if (!formData.benefit?.length) {
            newErrors.benefit = 'At least one benefit is needed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = () => {
        if (!validateForm()) return
        if(isAdding) return addJobPost()
        if(editingId) return handleUpdate(editingId)
    };

    const handleCancel = () => {
        setEditingId(null)
        setIsAdding(false)
        setOpenModal(false)
    }

    return (
        <div>
            {(isAdding || editingId) && (
                <div className="z-100 fixed inset-0 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">{isAdding ? "Create" : "Edit"} Job Post</h2>
                            <button
                                onClick={() => resetForm()}
                                title="close"
                                className="cursor-pointer text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <InputTag 
                                title="Job Title" 
                                type="text"
                                value={formData.title} 
                                placeholder="e.g. Senior Software Engineer" 
                                maxLength={50}
                                handleChange={(e) => handleChange('title', e.target.value)}
                                errors={errors.title} 
                            />

                            {/* Industry */}
                            <SelectTag 
                                title="Industry"
                                value={formData.industry}
                                handleChange={(e) => handleChange('industry', e.target.value)}
                                options={industries}
                                errors={errors.industry}
                            />

                            {/* Employment Type & Experience */}
                            <div className="grid grid-cols-2 gap-4">
                                <SelectTag 
                                    title="Employment Type"
                                    value={formData.industry}
                                    handleChange={(e) => handleChange('employment_type', e.target.value)}
                                    options={employmentTypes}
                                    errors={errors.employment_type}
                                />

                                <SelectTag 
                                    title="Experience"
                                    value={formData.experience}
                                    handleChange={(e) => handleChange('experience', e.target.value)}
                                    options={experienceLevels}
                                    errors={errors.experience}
                                />
                            </div>

                            {/* Salary Range */}
                            <div className="grid grid-cols-2 gap-4">
                                <InputTag 
                                    title="Salary Start" 
                                    type="number"
                                    value={formData.salary_start} 
                                    errors={errors.salary_start} 
                                    placeholder="4000" 
                                    min={1}
                                    handleChange={(e) => handleChange('salary_start', parseInt(e.target.value) || 0)}
                                />

                                <InputTag
                                    title="Salary End" 
                                    type="number"
                                    value={formData.salary_end} 
                                    handleChange={(e) => handleChange('salary_end', parseInt(e.target.value) || 0)}
                                    min={1}
                                    placeholder="6000" 
                                    errors={errors.salary_end} 
                                />
                            </div>

                            {/* Location */}
                            <SelectTag 
                                title="Location"
                                value={formData.location}
                                handleChange={(e) => handleChange('location', e.target.value)}
                                options={locations}
                                errors={errors.location}
                            />

                            {/* Contact Email */}
                            <InputTag
                                title="Contact Email" 
                                type="email"
                                value={formData.contact_email} 
                                handleChange={(e) => handleChange('contact_email', e.target.value)}
                                maxLength={65}
                                placeholder="hr@company.com" 
                                errors={errors.contact_email} 
                            />


                            {/* Summary */}
                            <TextAreaTag 
                                title="Summary"
                                value={formData.summary}
                                handleChange={(e) => handleChange('summary', e.target.value)}
                                rows={2}
                                maxLength={500}
                                placeholder="A brief one-line summary of the role"
                                errors={errors.summary}
                            />

                            {/* Description */}
                            <TextAreaTag 
                                title="Description"
                                value={formData.description}
                                handleChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                maxLength={500}
                                placeholder="Detailed description of the role and what the candidate will do"
                                errors={errors.description}
                            />

                            {/* Requirements */}
                            <ListTag
                                title="Requirements"
                                handleAdd={() => handleArrayAdd('requirements')}
                                data={formData.requirements}
                                field="requirements"
                                handleArrayChange={handleArrayChange}
                                placeholder="Enter requirement"
                                maxLength={200}
                                handleArrayRemove={handleArrayRemove}
                                errors={errors.requirements}
                            />

                            {/* Responsibilities */}
                            <TextList 
                                title="Responsibilities"
                                handleAdd={() => handleArrayAdd('responsibilities')}
                                data={formData.responsibilities}
                                field="responsibilities"
                                handleArrayChange={handleArrayChange}
                                placeholder="Enter responsibility"
                                rows={2}
                                maxLength={500}
                                handleArrayRemove={handleArrayRemove}
                                errors={errors.responsibilities}
                            />
                            
                            {/* Benefits */}
                            <ListTag
                                title="Benefits"
                                handleAdd={() => handleArrayAdd('benefit')}
                                data={formData.benefit}
                                field="benefit"
                                handleArrayChange={handleArrayChange}
                                placeholder="Enter benefit"
                                maxLength={200}
                                handleArrayRemove={handleArrayRemove}
                                errors={errors.benefit}
                            />


                            {/* Error message */}
                            {errors.submit && (
                                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500">
                                    {errors.submit}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleCancel}
                                    className="cursor-pointer flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="cursor-pointer flex-1 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    {isAdding ? "Create": "Update"} Job Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*Post New Job button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <h2 className="text-xl lg:text-2xl font-bold shrink-0">Job Posts</h2>
                    <select 
                        value={filterJobPost}
						onChange={(e) => setFilterJobPost(e.target.value)}
                        className="flex-1 lg:flex-none focus:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Jobs</option>
                        <option value="active">active</option>
                        <option value="removed">removed</option>
                    </select>
                </div>
                
                {isMember && (
                    <PlusButton  
                        title="Post New Job"
                        handleAdd={() => setIsAdding(true)}
                    />
                )}
            </div>

            {/*Display all job posts of that company */}
            <div className="grid gap-4">
                {filteredJobPost.map(job => (
                    <div key={job.job_post_id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="flex flex-col lg:flex-row justify-between gap-3 lg:gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold ">{job.title}</h3>
                                    {/* button to toogle edit & delete */}
                                    {isMember && <MoreMenu
                                        onEdit={() => handleEdit(job)}
                                        onDelete={() => handleDelete(job.job_post_id)}
                                        onRestore={() => handleRestore(job.job_post_id)}
                                        removed={job.removed}
                                    />}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">

                                    {/* Location Badge */}
                                    <Badge icon={MapPin} variant="purple">
                                        {job.location}
                                    </Badge>

                                    {/* Employment Type Badge */}
                                    <Badge icon={Clock} variant="pink">
                                        {formatEmploymentType(job.employment_type)}
                                    </Badge>

                                    {/* Salary Badge */}
                                    <Badge variant="green">
                                        ${formatSalary(job.salary_start)} - ${formatSalary(job.salary_end)}
                                    </Badge>

                                    {/* Industry Badge */}
                                    <Badge variant="cyan">
                                        {job.industry}
                                    </Badge>

                                    {/* Removed Badge */}
                                    {
                                        job.removed && <Badge variant="red">
                                            Removed
                                        </Badge>
                                    }
                                    
                                </div>

                                {/*Job summary */}
                                <div className="text-slate-300">
                                    {job.summary}
                                </div>

                                <div className="mt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-white/60 text-sm">
                                    {/* Info Section: Stacked on mobile, row on large screens */}
                                    <div className="flex flex-col sm:flex-row lg:items-center gap-3 sm:gap-4">
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Calendar className="w-4 h-4" />
                                            Posted {getDaysAgo(job.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1 shrink-0">
                                            <Users className="w-4 h-4" />
                                            {job.applicantCount} applicants
                                        </span>
                                    </div>
                                    
                                    {/* Action Section: Full width on mobile, auto width on large screens */}
                                    <div className="w-full lg:w-auto">
                                        <Link 
                                            to={`/job_post/${job.job_post_id}`}
                                            target="_blank"
                                            className="flex items-center justify-center w-full lg:px-4 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span className="ml-2 lg:hidden">View Details</span> {/* Optional text for mobile clarity */}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default JobPost