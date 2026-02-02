import backend_domain from "./backend_domain";

// get all user data
const getUser = async (user_id, token) => {
    const response = await fetch(`${backend_domain}/api/user/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// update summary, name, role, image only
const updateUser = async (field, field_id,  reqBody, token) => {
    const response = await fetch(`${backend_domain}/api/${field}/${field_id}`, {
        method: 'PUT', //
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        // The body must be stringified
        body: JSON.stringify(reqBody)
    });
    return response;
};


// add user data like experience, links, skills etc
const addUserData = async (user_id, reqBody, field, token) => {

    const response = await fetch(`${backend_domain}/api/user/${user_id}/${field}`, {
        method: 'POST', //
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}

// delete experience, skills, links etc
const deleteUserData = async (field, field_id, token) => {
    
    const response = await fetch(`${backend_domain}/api/${field}/${field_id}`, {
        method: 'DELETE', //
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
            
        }
    });
    return response;
}

// to register or login
const authUser = async(field, reqBody) => {

     const response = await fetch(`${backend_domain}/api/${field}/`, {
        method: 'POST', //
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}

export {
    getUser,
    updateUser,
    addUserData,
    deleteUserData,
    authUser
}