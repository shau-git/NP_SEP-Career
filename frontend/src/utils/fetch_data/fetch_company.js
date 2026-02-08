import backend_domain from "./backend_domain";
let endpoint = `${backend_domain}/api/company`

const getCompanies = async (query) => {
    let link = endpoint
    if(query) {
        link += `?${query}`
    }
    const response = await fetch(link, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response;
}
 
// get singe company data
const getOneCompany = async (company_id, token) => {
    const response = await fetch(`${endpoint}/${company_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// update company data
const updateCompany = async (company_id,  reqBody, token) => {
    const response = await fetch(`${endpoint}/${company_id}`, {
        method: 'PUT',
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
const createCompany = async (reqBody, token) => {

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}


// get singe company data
const getCompanyStats = async (company_id, token) => {
    const response = await fetch(`${endpoint}/${company_id}/stats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};


export {
    getOneCompany,
    updateCompany,
    createCompany,
    getCompanyStats,
    getCompanies
}