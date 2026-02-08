import {Edit2} from "lucide-react"
import {motion} from "framer-motion"

const EditButton2 = ({handleEdit}) => {
    return (
        <motion.button
            whileHover={{
                backgroundColor: "rgba(59,130,246,0.2)"
            }}
            onClick={handleEdit}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-left text-white "
            title="Edit"
        >
            <Edit2 className="w-4 h-4 text-blue-400" />
        </motion.button>
    )
}

export default EditButton2