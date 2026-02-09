import { useState, useEffect, useRef } from 'react';
import { MoreVertical,Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicantMoreMenu = ({handleStatusChange, applicant,setOpenInterviewModal}) => {
    const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);


	return (
		<div className="relative shrink-0" ref={menuRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className="p-2 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
				title="Options"
				aria-label="More options"
			>
				<MoreVertical className="w-5 h-5 text-white/60" />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
                <div className="flex lg:flex-col gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setOpenInterviewModal(applicant.applicant_id)}
                        className="cursor-pointer flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
                    >
                        Interview
                    </button>
                    <button
                        onClick={() => handleStatusChange(applicant.applicant_id, {status:'ACCEPTED'})}
                        className="cursor-pointer flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleStatusChange(applicant.applicant_id, {status: 'REJECTED'})}
                        className="cursor-pointer flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleStatusChange(applicant.applicant_id, {status: 'WITHDRAWN'})}
                        className="cursor-pointer flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={() => handleStatusChange(applicant.applicant_id, {status: 'PENDING'})}
                        className="cursor-pointer flex-1 lg:flex-none px-3 lg:px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-all text-xs lg:text-sm whitespace-nowrap"
                    >
                        Pending
                    </button>
                </div>
			)}
            <Link 
                to={`/user/${applicant.user_id}`}
                target="_blank"
                className="mt-2 flex items-center justify-center w-full lg:px-4 p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
            >
                <Eye className="w-4 h-4" />
                <span className="ml-2 lg:hidden">View Details</span> {/* Optional text for mobile clarity */}
            </Link>
		</div>
    )
}

export default ApplicantMoreMenu