import {motion} from "framer-motion"
const CancelButton = ({handleCancel}) => {
    return (
        <motion.button 
            onClick={handleCancel}
            whileHover={{
                backgroundColor: "rgba(168,85,247,0.4)"
            }}
            className="cursor-pointer px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-[14px]"
        >
            Cancel
        </motion.button>
    )
}

export default CancelButton