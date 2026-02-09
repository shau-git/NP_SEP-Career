import backend_domain from "./backend_domain";

// get all company job applicant
const getJobApplicantCompany = async (company_id, token, job_post_id=null) => {
    let endpoint = `${backend_domain}/api/company/${company_id}/jobapplicant`
    if(job_post_id) {endpoint += `?job_post_id=${job_post_id}`}

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response
};

// get user's own job applicant
const getJobApplicantUser = async (user_id, token) => {
    const response = await fetch(`${backend_domain}/api/user/${user_id}/jobapplicant`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response
};

// update applicant status
const updateApplicant = async (applicant_id, reqBody, token) => {
    const response = await fetch(`${backend_domain}/api/jobapplicant/${applicant_id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}


export {
    getJobApplicantCompany,
    getJobApplicantUser,
    updateApplicant
}