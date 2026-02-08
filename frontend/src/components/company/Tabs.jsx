const Tabs = ({setActiveTab, activeTab, target, title}) => {
    return (
        <button
            onClick={() => setActiveTab(target)}
            className={`cursor-pointer px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'jobs' ? 'text-white' : 'text-white/60 hover:text-white/80'
            }`}
        >
            {title}
            {activeTab === target && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-pink-500"></div>
            )}
        </button>
    )
}

export default Tabs