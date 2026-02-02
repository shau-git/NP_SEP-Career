import React from 'react'
import {EditButton, Title} from "../../components/utils/utils_config"//"@/components/user/utils/utils_config"

const Summary = ({session,  user_id, handleEditSummary, handleSaveSummary,handleCancelSummary,  editMode, summaryDraft, setSummaryDraft, summary}) => {
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <Title title="About Me"/>
                {session.user_id == user_id && <EditButton handleEdit={handleEditSummary}/>}
            </div>
            { editMode.summary ? (
                <div>
                    <textarea
                        value={summaryDraft}
                        onChange={(e) => setSummaryDraft(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white/90 min-h-32 focus:outline-none focus:border-purple-500"
                        maxLength={500}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button 
                            onClick={handleCancelSummary}
                            className="cursor-pointer px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-[14px]"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveSummary}
                            className="cursor-pointer px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all text-[14px]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-white/70 leading-relaxed">{summary}</p>
            ) }
        </div>
    )
}

export default Summary