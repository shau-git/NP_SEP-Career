import {Edit2} from "lucide-react"

const EditButton2 = ({handleEdit}) => {
    return (
        <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-blue-500/20 transition-all"
        >
            <Edit2 className="w-4 h-4 text-blue-400" />
        </button>
    )
}

export default EditButton2