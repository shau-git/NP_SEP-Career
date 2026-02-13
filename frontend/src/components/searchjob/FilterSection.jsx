import {ChevronDown} from "lucide-react"

const FilterSection = ({title, filterType, options, filters, loading, handleFilterChange}) => (
    <div className="mb-6">
        <button className="flex items-center justify-between w-full mb-3">
            <h4 className="text-sm font-medium text-slate-200">{title}</h4>
            <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
        <div className="space-y-2">
            {options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        // Check against the value (e.g., "full time")
                        checked={filters[filterType].includes(option.value)}
                        // Pass the value to the handler
                        onChange={() => handleFilterChange(filterType, option.value)}
                        disabled={loading}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-slate-100">
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    </div>
);

export default FilterSection
