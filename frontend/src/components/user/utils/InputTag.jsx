const InputTag = ({
    label, 
    type, 
    name, 
    value, 
    handleChangeFunc, 
    placeholder,
    maxLength,
    error
}) => {
    return (
        <div>
            <label className="block text-white/80 font-medium mb-2 text-sm">
                {label}
            </label>
            
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChangeFunc}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`w-full bg-white/5 border ${
                error? 'border-red-500/50' : 'border-white/20'
                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500`}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    )
}

export default InputTag