import {motion} from "framer-motion"
const ActionsButton = ({title, handleCancel, handleSubmit}) => {
    return (

        <div className="flex gap-4 pt-4 border-t border-gray-700">
            <motion.button
                whileHover={{
                    backgroundColor: "rgba(255,255,255,0.2)"
                }}
                onClick={handleCancel}
                className="cursor-pointer flex-1 px-6 py-3 bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
                Cancel
            </motion.button>
            <motion.button
                whileHover={{
                    boxShadow: "0 0 25px rgba(168,85,247,0.5)",
                }}
                onClick={handleSubmit}
                className="cursor-pointer flex-1 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600  rounded-lg text-white font-medium transition-colors"
            >
                {title}
            </motion.button>
        </div>
    )
}

export default ActionsButton