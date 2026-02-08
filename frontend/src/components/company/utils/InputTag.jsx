const InputTag = ({
    title, 
    type,
    value, 
    errors, 
    placeholder, 
    maxLength,
    handleChange,
    min
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {title} <span className="text-red-500">*</span>
            </label>
            <input
                type={type}
                value={value || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                maxLength={maxLength}
                placeholder={placeholder}
                min={min}
            />
            {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
        </div>
    )
}

export default InputTag