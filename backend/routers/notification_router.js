const express = require("express")
const router = express.Router()
const auth = require("../middlewares/authentication")
const {getNotifications, updateNotification, markAllNotificationsAsRead} = require("../controllers/notification_controller")
const {
    updateNotificationSchema, 

} = require("../middlewares/validators_config")

// get all nitification
router.post('/', auth, getNotifications)

// mark all notification as read
router.post('/markall', auth, markAllNotificationsAsRead)

// mark 1 notification as read
router.put('/:notification_id', auth, updateNotificationSchema, updateNotification)

module.exports = router