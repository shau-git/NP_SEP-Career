import {ArrowLeft, MapPin} from "lucide-react"
import {EditButton, Title} from "../user/utils/utils_config"
import {InputTag, SelectTag} from "../user/utils/utils_config"
import {ProfileImage} from "../user/utils/utils_config"

const CompanyProfile = ({handleChange, errors, isMember, token, session, editMode, handleEdit, formDraft, company, setCompany}) => {
    
    const { image, name, industry, role,  location} = company
    const industryOption = [
        'IT & Technology', 
        'Healthcare', 
        'Finance & Business', 
        'F&B (Food & Bev)', 
        'Creative & Media', 
        'Education', 
        'Engineering', 
        'Retail & Sales', 
        'Logistics & Trades'
    ]
    const changeImage = (image) => {
        setCompany(prev => ({ ...prev, image }));
    }

    return (
        <div className={`flex justify-between items-start mb-4 pr-5`}>
            <div className="flex items-center gap-4">
                {/* Company Profile info*/}
                <div className={`flex flex-col items-start gap-4 flex-1`}>
                    {/* Profile Pic*/}
                    <ProfileImage show={(session && token && isMember && (role === "owner" || role === "admin"))? true : false} data={company} tableName="company" {...{changeImage, token}}/>
                    
                    {/*company name, location, industry */}
                    {
                        editMode ? (
                            <>
                                <InputTag 
                                    label="Company name *"
                                    type="text"
                                    name="name"
                                    value={formDraft.name}
                                    handleChangeFunc={handleChange}
                                    placeholder="e.g., Google"
                                    maxLength={50}
                                    error={errors.name}
                                />
                                <InputTag 
                                    label="Location *"
                                    type="text"
                                    name="location"
                                    value={formDraft.location}
                                    handleChangeFunc={handleChange}
                                    placeholder="e.g., Singapore"
                                    maxLength={50}
                                    error={errors.location}
                                />
                                <SelectTag 
                                    field="Industry *"
                                    name="industry"
                                    value={formDraft.industry}
                                    handleChangeFunc={handleChange}
                                    options={industryOption}
                                />
                            </>
                        ) : (
                            <div>
                                <h1 className="text-2xl font-bold text-blue-400">{name}</h1>
                                <div className="flex items-center gap-4 text-purple-300 text-sm">
                                    <span>{industry}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {location}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {/* Edit button */}
            {session && token && isMember && (role === "owner" || role === "admin") && (
                !editMode && <EditButton {...{handleEdit}}/>
            )}
        </div>
    )
}

export default CompanyProfile