import {motion} from 'framer-motion'

const CloseButton = ({handleArrayRemove}) => {
    return (
        <motion.button
            whileHover={{
                backgroundColor: "rgba(185,28,28,0.7)"
            }}
            onClick={handleArrayRemove}
            className="absolute -top-1 -right-2 cursor-pointer w-5 h-5 flex items-center justify-center bg-red-600/80 rounded-full text-white text-[10px] transition-all shadow-lg z-10"
        >
            ✕
        </motion.button>
    )
}

export default CloseButton