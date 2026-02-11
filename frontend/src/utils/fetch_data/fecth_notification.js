import backend_domain from "./backend_domain";

const getNotification = async (token) => {

    const response = await fetch(`${backend_domain}/api/notification`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
}
 
const putOneNotification = async (notification_id, token) => {
    const response = await fetch(`${backend_domain}/api/notification/${notification_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({is_read: true})
    });
    return response;
}


const putAllNotification = async (token) => {

    const response = await fetch(`${backend_domain}/api/notification/markall`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
    });
    return response;
}
export {
    getNotification,
    putOneNotification,
    putAllNotification
}