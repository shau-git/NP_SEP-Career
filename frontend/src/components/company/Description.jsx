import {EditButton, Title, Description as DescriptionForm} from "../user/utils/utils_config"

const Description = ({handleChange, editMode, description, formDraft, errors}) => {

    return (
        <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <Title title="About Us"/>
            </div>
            { editMode ? (
                <div>
                    <DescriptionForm
                        value={formDraft.description || ""}
                        handleChange={handleChange}
                        placeholder="Describe your company..."
                        maxLength={500}
                        rows={3}
                        errors={errors}
        
                    />
                </div>
            ) : (
                <p className="text-white/70 leading-relaxed">{description}</p>
            ) }
        </div>
    )
}

export default Description