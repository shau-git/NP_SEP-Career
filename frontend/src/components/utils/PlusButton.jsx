import React from 'react'
import {Plus} from 'lucide-react'

const PlusButton = ({handleClick}) => {
    return (
        <button 
            onClick={handleClick}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all cursor-pointer text-[13px]"
        >
            <Plus className="w-5 h-5" />
            Add
        </button>
    )
}

export default PlusButton