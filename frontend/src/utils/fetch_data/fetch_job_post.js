import backend_domain from "./backend_domain";

const getJobPost = async (query=null) => {
    let endpoint = `${backend_domain}/api/jobpost`
    if(query) endpoint += `?${query}`

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    return response
};

const getOneJobPost = async (job_post_id) => {
    const response = await fetch(`${backend_domain}/api/jobpost/${job_post_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response;
};

const updateJobPost = async (company_id, job_post_id, token, reqBody) => {
    const response = await fetch(`${backend_domain}/api/company/${company_id}/jobpost/${job_post_id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
};


const createJobPost = async (company_id,  token, reqBody) => {
    const response = await fetch(`${backend_domain}/api/company/${company_id}/jobpost/`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
};


export {
    getJobPost,
    getOneJobPost,
    updateJobPost,
    createJobPost
}