import backend_domain from "./backend_domain";

const getPlatformStats= async () => {
    const response = await fetch(`${backend_domain}/api/platformstats/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response;
};

export default getPlatformStats