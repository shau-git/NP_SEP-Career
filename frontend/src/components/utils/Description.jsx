const Description = ({
    value,
    handleChange,
    placeholder,
    maxLength,
    rows,
    errors
}) => {
    return (
        <div className="md:col-span-2">
            <label className="block text-white/80 font-medium mb-2 text-sm">
                Description *
            </label>
            <textarea
                name="description"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                className={`w-full bg-white/5 border ${
                errors.description ? 'border-red-500/50' : 'border-white/20'
                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none`}
            />
            <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                <p className="text-white/40 text-xs ml-auto">{value?.length}/{maxLength}</p>
            </div>
        </div>
    )
}

export default Description