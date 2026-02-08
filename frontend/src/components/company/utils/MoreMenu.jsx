import { useState, useEffect, useRef } from 'react';
import { MoreVertical  } from 'lucide-react';
import {DeleteButton, EditButton2} from "../../user/utils/utils_config"
import {RestoreButton} from "./company_util_config"

export default function MoreMenu({ onEdit , onDelete , onRestore, removed}) {
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

	const handleEdit = () => {
		onEdit();
		setIsOpen(false);
	};

	const handleDelete = () => {
		onDelete();
		setIsOpen(false);
	};

    const handleRestore = () => {
        onRestore()
        setIsOpen(false)
    }

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
					className={`absolute  top-10 right-0 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden z-10`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex">
						{
                            removed? 
                                <RestoreButton {...{handleRestore}}/>
                            : (
                                <>
                                    <EditButton2 {...{handleEdit}}/>
                                    <DeleteButton {...{handleDelete}}/>
                                </>
                                
                            )
                        }
					</div>
					

				</div>
			)}
		</div>
    );
}