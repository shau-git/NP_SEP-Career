const { UnauthenticatedError, NotFoundError, ForbiddenError, BadRequestError, } = require("../errors/errors");
const Notification = require("../models/notification")
const User = require("../models/user")
const Company = require("../models/company")
const asyncWrapper = require("./utils/wrapper");

const getNotifications = asyncWrapper(async (req, res) => {

    const user_id = parseInt(req.user.user_id);
    
    // 2. Fetch notifications with associations (includes)
    const notifications = await Notification.findAll({
        where: {user_id},
        // Order by created_at descending, then ID descending
        order: [
            ['notification_id', 'DESC']
        ],
        include: [
            {
                model: User,
                as: 'sender', // Ensure this matches the alias in your model associations
                attributes: ['name', 'image']
            },
            {
                model: Company,
                as: 'company',
                attributes: ['name', 'image']
            }
        ]
    });

    // 3. Return standard JSON response
    return res.status(200).json({
        total: notifications.length,
        data: notifications
    });
});


// GET count of unread notifications
const getUnreadNotificationCount = asyncWrapper(async (req, res) => {
    // Assuming your auth middleware provides the user_id via req.user
    const { user_id } = req.user;

    const unreadCount = await Notification.count({
        where: {
            user_id: user_id,
            is_read: false // Matches the typical naming convention for unread status
        }
    });

    return res.status(200).json({
        success: true,
        data: unreadCount
    });
});


// mark one notification as read
const updateNotification = asyncWrapper(async (req, res) => {

    const current_user_id = parseInt(req.user.user_id);
    const { notification_id } = req.params;
    const value = req.body; // Validation already handled by middleware in route

    // 1. Validate ID format
    if (isNaN(Number(notification_id))) {
        throw new BadRequestError(`Notification ID must be a number: ${notification_id}`);
    }

    // 2. Fetch notification for ownership check
    const notification = await Notification.findByPk(notification_id);

    // 3. Existence Check
    if (!notification) {
        throw new NotFoundError(`Notification with ID ${notification_id} not found`);
    }

    // 4. Ownership Check (Security: Users can only update their own notifications)
    if (notification.user_id !== current_user_id) {
        throw new ForbiddenError("You do not have permission to modify this notification");
    }

    // 5. Proceed with the update
    // Sequelize update returns an array: [number of affected rows, [the updated rows]]
    const [affectedCount, updatedRows] = await Notification.update(value, {
        where: { notification_id },
        returning: true, // Specific to PostgreSQL/Neon
        plain: true      // Returns the single updated object instead of an array
    });

    return res.status(200).json({ 
        message: "Notification updated successfully", 
        data: updatedRows 
    });
});


// mark all notification as read
const markAllNotificationsAsRead = asyncWrapper(async (req, res) => {
    const user_id = parseInt(req.user.user_id);

    // 1. Update all unread notifications for this user
    // Sequelize update returns an array where the first element is the count of affected rows
    const [count] = await Notification.update(
        { is_read: true }, // The data to update
        { 
            where: { 
                user_id: user_id,
                is_read: false 
            } 
        }
    );

    // 2. Return response with the count of items updated
    return res.status(200).json({ 
        message: `Successfully marked ${count} notifications as read.` 
    });
});

module.exports = {
    getNotifications,
    getUnreadNotificationCount,
    updateNotification,
    markAllNotificationsAsRead
};