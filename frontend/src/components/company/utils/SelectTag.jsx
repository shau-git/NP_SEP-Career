const SelectTag = ({
    title,
    value,
    handleChange,
    options,
    errors,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {title} <span className="text-red-500">*</span>
            </label>
            <select
                value={value || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
                {options.map(op => (
                    <option key={op} value={op}>{op}</option>
                ))}
            </select>
            {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
        </div>
    )
}

export default SelectTag