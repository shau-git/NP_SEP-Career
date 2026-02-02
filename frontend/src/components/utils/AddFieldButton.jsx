import {Save} from 'lucide-react'

const AddFieldButton = ({handleAdd, field}) => {
    return (
        <button
            onClick={handleAdd}
            className="px-2 py-1 text-[14px] bg-linear-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
        >
            <Save className="w-4 h-4" />
            Add {field}
        </button>
    )
}

export default AddFieldButton