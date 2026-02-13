const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {getNotifications, updateNotification, markAllNotificationsAsRead, getUnreadNotificationCount} = require("../controllers/notification_controller")
const {
    updateNotificationSchema, 

} = require("../middlewares/validators_config")

// get all nitification
router.get('/', auth, getNotifications)

// get notification count 
router.get('/unread_count', auth, getUnreadNotificationCount)

// mark all notification as read
router.put('/markall', auth, markAllNotificationsAsRead)

// mark 1 notification as read
router.put('/:notification_id', auth, updateNotificationSchema, updateNotification)

module.exports = router