import backend_domain from "../backend_domain";

const getJobPost = async () => {
    const response = await fetch(`${backend_domain}/api/jobpost`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    return data;
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


export {
    getJobPost,
    getOneJobPost
}