import {Trash2} from "lucide-react"

const DeleteButton = ({handleDelete}) => {
    return (
        <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-red-500/20 transition-all border-t border-white/10"
            title="Delete"
        >
            <Trash2 className="w-4 h-4 text-red-400" />
        </button>
    )
}

export default DeleteButton