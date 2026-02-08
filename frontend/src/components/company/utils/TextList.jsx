import {CloseButton} from "./company_util_config"

const TextList = ({
    title,
    handleAdd,
    data,
    field,
    handleArrayChange,
    placeholder,
    rows,
    maxLength,
    handleArrayRemove,
    errors,

}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                    {title} <span className="text-red-500">*</span>
                </label>
                <button
                    onClick={handleAdd}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition-colors"
                >
                    + Add
                </button>
            </div>
            <div className="space-y-2">
                {data?.map((data, index) => (
                    <div key={index} className="flex gap-2 relative group w-full mb-4">
                        <textarea
                            value={data}
                            onChange={(e) => handleArrayChange(field, index, e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder={placeholder}
                            rows={rows}
                            maxLength={maxLength}
                        />
                        <CloseButton handleArrayRemove={() => handleArrayRemove(field, index)}/>
                    </div>
                ))}
            </div>
            {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
        </div>
    )
}

export default TextList