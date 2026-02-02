import React from 'react'

const InputEndDate = ({
    handleChange, 
    errors, 
    formData, 
    setFormData
}) => {
    return (
        <div>
            <label className="block text-white/80 font-medium mb-2 text-sm">
                End Date *
            </label>
            <div className="flex gap-2">
                <input
                    type="date"
                    name="end_date"
                    value={formData.end_date === 'present' ? '' : formData.end_date}
                    onChange={handleChange}
                    disabled={formData.end_date === 'present'}
                    className={`w-full bg-white/5 border ${
                    errors.end_date ? 'border-red-500/50' : 'border-white/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500`}
                />
                <button
                    type="button"
                    onClick={() => setFormData({ 
                        ...formData, 
                        end_date: formData.end_date === 'present' ? '' : 'present' 
                    })}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.end_date === 'present'
                        ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                >
                    Present
                </button>
            </div>
            
            {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
        </div>
    )
}

export default InputEndDate