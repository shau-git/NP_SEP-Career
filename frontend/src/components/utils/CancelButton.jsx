import {X} from "lucide-react"

const CancelButton = ({resetForm}) => {
    return (
        <button
            onClick={resetForm}
            className="px-2 py-1 text-[14px] bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-all flex items-center gap-2"
        >
            <X className="w-4 h-4" />
            Cancel
        </button>
    )
}

export default CancelButton