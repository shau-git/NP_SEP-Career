import {useState} from 'react'
import { toast } from 'react-toastify';
import {Stats, Description, CompanyProfile} from "./company_config"
import {SaveButton, CancelButton} from "./utils/company_util_config"
import {
	updateCompany, 
} from "../../utils/fetch_data/fetch_config"

const CompanyHeaders = ({session, token, company_id, company, setCompany, isMember, stats, statsLoading}) => {
    const {image, name, industry, location, description, role} = company

    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [formDraft, setFormDraft] = useState({
        name: '',
        industry: 'IT & Technology',
        location: '',
        description: ''
    })



    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formDraft.name.trim()) newErrors.name = 'Company name is required';
        else if (formDraft.name.length > 50) newErrors.name = 'Max 50 characters';

        if (!formDraft.location.trim()) newErrors.location = 'Location is required';
        else if (formDraft.location.length > 50) newErrors.location = 'Max 50 characters';

        if (!formDraft.description.trim()) newErrors.description = 'Description is required';
        else if (formDraft.description.length > 500) newErrors.description = 'Max 500 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleEdit = () => {
        // save company's data to a draft
        setFormDraft({
            name,
            industry,
            location,
            description: description || ''
        })
        
        // set the description to edit mode
        setEditMode(true);
    };

     // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
            setFormDraft({ ...formDraft, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const response = await updateCompany(company_id, formDraft, token);
            const data = await response.json()

            if(response.status === 200){
                // update company state
                setCompany({ ...company, ...formDraft})
                // clear edit mode
                toast.success(data.message);
                setEditMode(false)
            } else if(response.status !== 200) {
                toast.error(data.message)
            } else {
                toast.error("Error updating company data!")
            }
            
        } catch (error) {
            console.error('Error updating summary:', error);
            toast.error(error);
        }
    };

    const handleCancel = () => {
        // change back to normal mode
        setEditMode(false);
        setErrors({})
    };

    return (
        <div className="bg-white/5 rounded-xl p-4 border border-cyan-500/40 shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)]">

            <CompanyProfile {...{ handleChange, errors, isMember, token, session, editMode, handleEdit, formDraft, company, setCompany}}/>

            {/* Company description */}
            <Description {...{handleChange, editMode, description, formDraft, setFormDraft, errors}}/>

            {editMode && <div className="flex justify-end">
                <div className="flex justify-end gap-2 mb-6">
                    <CancelButton {...{handleCancel}}/>
                    <SaveButton {...{handleSave}}/>
                </div> 
            </div>}

            {/* Company Stats */}
            {session && token && isMember && <Stats stats={stats} loading={statsLoading} />}
        </div>
        
    )
}

export default CompanyHeaders