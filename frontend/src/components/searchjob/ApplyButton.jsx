import {motion} from "framer-motion"
const ApplyButton = ({handleClick, title}) => {
    return (
        <motion.button 
            whileHover={{
                boxShadow: "0 0 25px rgba(168,85,247,0.5)",
            }}
            onClick={handleClick}
            className="cursor-pointer flex-1 px-4 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg text-[14px]"
        >
            {title}
        </motion.button>
    )
}

export default ApplyButton