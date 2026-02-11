import { useState , useEffect} from 'react';
import { Bell, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import {getNotification, putOneNotification, putAllNotification} from "../utils/fetch_data/fetch_config"
import {formatDate} from "../utils/formatting"
import {toast} from "react-toastify"
import { useParams , useNavigate} from 'react-router-dom';

const NotificationPage = () => {
	let {user_id} = useParams();
	user_id = parseInt(user_id)
  
	const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    // function to fetch notification data
    const fetchNotificationData = async (token) => {
        try {
            const response = await getNotification(token)
            const data = await response.json();
            if(response.status === 200) {
				setNotifications([
					...data.data,
					...notifications
				])
            } else {
              	toast.error(data.message)
            } 
        } catch (error) {
			toast.error(error)
			console.error(error)
        }
    };

    useEffect(() => {
		if(!user_id) {
            toast.error("User Id must be a number")
            return navigate('/')
        }
        const token = getToken()
        const session = getSession()
		if(!token || !session){
			return navigate('/')
		} else if(session.user_id !== user_id) {
			toast.error("You can only view your notification!")
			return navigate('/')
		}

        fetchNotificationData(token)
    },[])

    const getNotificationColor = (type) => {
        const colors = {
            // Member Management (Blue/Indigo - Administrative)
			COMPANY_MEMBER_ADD: 'bg-indigo-500/20 text-indigo-400',
			COMPANY_MEMBER_REMOVE: 'bg-rose-500/20 text-rose-400',
			COMPANY_MEMBER_UPDATE: 'bg-sky-500/20 text-sky-400',

			// Company/Job Management (Amber/Cyan - Informational)
			COMPANY_PROFILE_UPDATE: 'bg-amber-500/20 text-amber-400',
			JOB_POST_CREATED: 'bg-emerald-500/20 text-emerald-400',
			JOB_POST_UPDATED: 'bg-cyan-500/20 text-cyan-400',

			// Applicant Activities (Existing Blue/Purple Logic)
			APPLICANT_NEW: 'bg-blue-500/20 text-blue-400',
			APPLICANT_STATUS_CHANGE: 'bg-purple-500/20 text-purple-400',
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400';
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getToken = () => {
        return localStorage.getItem('token')
    }

    const getSession = () => {
        return JSON.parse(localStorage.getItem('user'))
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
		// - (8 * (1000 * 60 * 60) because new Date() will add more 8 hours
        const diffInHours = Math.floor((now - date - (8 * (1000 * 60 * 60))) / (1000 * 60 * 60)) ;
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

	// mark single notification as read
    const markAsRead = async (notificationId) => {
		try {
			const response = await putOneNotification(notificationId, getToken())
			const data = await response.json();
			if(response.status === 200) {
				setNotifications(notifications.map(not => 
					not.notification_id === notificationId ? { ...not, is_read: data.data.is_read } : not
				));
				
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch(error) {
			console.error(error)
		}
    };

	// function to mark all notification as read
    const markAllAsRead = async () => {
		try {
			const response = await putAllNotification(getToken())
			const data = await response.json();
			if(response.status === 200) {
				setNotifications(prev =>
					prev.map(notif => ({ ...notif, is_read: true }))
				);
				
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch(error) {
			console.error(error)
		}
        
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
		<div className="min-h-screen bg-slate-950 relative">
			{/* Header */}
			<div className="z-1 sticky top-0 bg-slate-900 backdrop-blur-sm border-b border-blue-900/30 pt-20">
				<div className="max-w-4xl mx-auto px-3 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="flex items-center gap-2 sm:gap-3">
								<div className="p-2 bg-blue-500/20 rounded-lg">
									<Bell className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
								</div>
								<div>
									<h1 className="text-md sm:text-xl font-semibold text-white">Notifications</h1>
									<p className="text-xs sm:text-sm text-gray-400">
										{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
									</p>
								</div>
							</div>
						</div>
						
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className="cursor-pointer w-33 flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
							>
								<CheckCheck className="w-4 h-4" />
								Mark all read
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Notifications List */}
			<div className="max-w-4xl mx-auto px-4 py-6">
				<div className="space-y-3">
					{notifications.map((notification) => {
						let image = false
						let alt
						// if (notification.sender) {
						// 	if(notification.sender.image) image = notification.sender.image
						// } else if (notification?.company.image) {
						// 	image = notification.company.image
						// }

						if (['COMPANY_PROFILE_UPDATE', 'JOB_POST_CREATED', 'APPLICANT_STATUS_CHANGE','JOB_POST_CREATED'].includes(notification.type)) {
							if(notification.company?.image) {
								image = notification?.company.image
								alt = notification?.company.name
							}
						} else {
							if(notification.sender?.image) {
								image = notification.sender?.image
								alt = notification.sender?.name
							}
						}

						return(
							<div
								key={notification.notification_id}
								className={`relative bg-[#162947]/40 backdrop-blur-sm border rounded-xl p-4 transition-all hover:border-blue-600/50 ${
									notification.is_read
									? 'border-blue-900/30 opacity-70'
									: 'border-blue-700/50 shadow-lg shadow-blue-900/20'
								}`}
							>
								{/* Unread indicator */}
								{!notification.is_read && (
									<div className="absolute top-4 right-4">
										<div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
									</div>
								)}

								<div className="flex gap-4">
									{/* Avatar */}
									<div className="shrink-0">
										{
											image ? (
												<img src={image} alt={notification.sender?.name || notification.company?.name} className="text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full shrink-0" />
											) : (
												<div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
													{getInitials(notification.sender?.name || notification.company?.name)}
												</div>
											)
										}
										
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-3 mb-2">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="font-medium text-white">
													{notification.sender?.name || notification.company?.name}
												</span>
												<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
													{notification.type}
												</span>
											</div>
											<span className="text-xs text-gray-500 whitespace-nowrap">
												{formatDate(notification.created_at)}
											</span>
										</div>

										<p className="text-gray-300 text-sm mb-3">
											{notification.message}
										</p>

										
										{/**notification.company?.name - Checks if company exists AND has a name property
											notification.sender?.name - Checks if sender exists AND has a name property*/}
										{notification.company?.name && notification.sender?.name && (
											<div className="flex items-center gap-2 text-xs text-gray-400">
												<span className="px-2 py-1 bg-blue-900/30 rounded">
													{notification.company.name}
												</span>
											</div>
										)}

										{/* Actions */}
										{!notification.is_read && (
											<div className="mt-3 pt-3 border-t border-blue-900/30">
												<button
													onClick={() => markAsRead(notification.notification_id)}
													className="cursor-pointer flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
												>
													<Check className="w-4 h-4" />
													Mark as read
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>

				{notifications.length === 0 && (
				<div className="text-center py-16">
					<div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
						<Bell className="w-12 h-12 text-gray-600" />
					</div>
					<h3 className="text-lg font-medium text-gray-400 mb-2">No notifications</h3>
					<p className="text-gray-500 text-sm">You're all caught up!</p>
				</div>
				)}
			</div>
		</div>
	);
};

export default NotificationPage;