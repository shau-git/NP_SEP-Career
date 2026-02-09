import { useState, useEffect, useRef } from 'react';
import { MoreVertical} from 'lucide-react';
import { EditButton2 } from '../../user/utils/utils_config';

const MemberMoreMenu = ({member, handleEdit}) => {
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
                <div 
					className={`z-50 absolute top-10 right-0 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden`}
					onClick={(e) => e.stopPropagation()}
				>
					 <EditButton2 handleEdit={() => handleEdit(member)}/>
				</div>
			)}
		</div>
    )
}

export default MemberMoreMenu