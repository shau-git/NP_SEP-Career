import {motion} from "framer-motion"
const SaveButton = ({handleSave}) => {
    return (
        <motion.button 
            whileHover={{
                boxShadow: "0 0 25px rgba(168,85,247,0.5)",
            }}
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg text-[14px]"
        >
            Save
        </motion.button>
    )
}

export default SaveButton