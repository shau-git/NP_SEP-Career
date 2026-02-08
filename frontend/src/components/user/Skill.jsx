import React from 'react'
import {EditButton, Title} from "./utils/utils_config"//"@/components/user/utils/utils_config"
import { X } from 'lucide-react';
import {motion} from "framer-motion"

const Skill = ({session, token, user_id, setEditMode, editMode, skills, handleRemoveSkill, newSkill, setNewSkill, handleAddSkill}) => {
    const handleEdit = () => {
        setEditMode({ ...editMode, skills: !editMode.skills })
    }
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Skills & Technologies"/>
            
                {(token && session.user_id == user_id) && <EditButton {...{handleEdit}}/>}
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
                {skills.map((skill) => (
                <div key={skill.skill_id} className="group relative">
                    <motion.span 
                        className="px-4 py-2 bg-[rgba(102,126,234,0.2)] border border-[rgba(102,126,234,0.3)] rounded-[25px] text-[14px] text-[#b8c5ff]"
                        whileHover={{ 
                            backgroundColor: "rgba(102,126,234,0.3)",
                            borderColor: "rgba(102,126,234,0.5)",
                        }}
                    >
                        {skill.skill}
                    </motion.span>
                    {editMode.skills && (
                        <button
                            onClick={() => handleRemoveSkill(skill.skill_id)}
                            className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                        )}
                    </div>
                ))}
            </div>
            {editMode.skills && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add new skill..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        maxLength={30}
                    />
                    <motion.button
                        whileHover={{
                            boxShadow: "0 0 25px rgba(168,85,247,0.5)",
                        }}
                        onClick={handleAddSkill}
                        className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                        Add
                    </motion.button>
                </div>
            )}
        </div>
    )
}

export default Skill