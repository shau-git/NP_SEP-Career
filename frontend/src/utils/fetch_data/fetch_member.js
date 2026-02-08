import backend_domain from "./backend_domain";

// get singe company data
const getCompanyMember = async (company_id, token, user_id=null) => {
    let endpoint = `${backend_domain}/api/company/${company_id}/companymember`

    if(user_id) (endpoint += `?user_id=${user_id}`)

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// update company data
const updateCompanyMember = async (company_id,  reqBody, token, company_member_id) => {

    const endpoint = `${backend_domain}/api/company/${company_id}/companymember/${company_member_id}`

    const response = await fetch(endpoint, {
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


// create company
const createCompanyMember = async ( reqBody, token) => {

    const endpoint = `${backend_domain}/api/company/${company_id}/companymember`

    const response = await fetch(endpoint, {
        method: 'POST', //
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}





export {
    getCompanyMember,
    updateCompanyMember,
    createCompanyMember,
}