import {motion} from "framer-motion"

const EditButton = ({handleEdit}) => {
    return (
        <motion.button 
            onClick={handleEdit}
            className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors "
            whileHover={{
                scale: 1.1 
            }}
       >
            ✏️
        </motion.button>
    )
}

export default EditButton