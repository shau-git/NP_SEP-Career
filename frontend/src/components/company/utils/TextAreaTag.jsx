const TextAreaTag = ({
    title,
    value,
    handleChange,
    rows,
    maxLength,
    placeholder,
    errors
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {title} <span className="text-red-500">*</span>
            </label>
            <textarea
                value={value}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
                {value?.length || 0}/500
            </div>
            {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
        </div>
    )
}

export default TextAreaTag