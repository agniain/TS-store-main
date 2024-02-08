import axios from 'axios';

const baseURL = `http://localhost:3001/api`
const authURL = `http://localhost:3001/auth`

const getToken = () => {
    return localStorage.getItem('token');
};

export const axiosGet = (url, params) => {
    const resource = baseURL + url;
    console.log('API Request URL:', resource);
  
    return axios.get(resource, {
      headers: {
        "Content-Type": "application/json",
      },
      params: params,
    });
  };

export const axiosGetWithToken = (url) => {
    const resource = baseURL + url;
    console.log(resource);

    return axios.get(resource, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
};

export const axiosPost = (url, data) => {
    return axios.post(`${baseURL}${url}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const axiosPostWithToken = (url, data) => {
    const resource = baseURL + url;
    console.log(resource);

    return axios.post(resource, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
};

export const axiosRegister = async (url, data) => {
    return axios.post(`${authURL}${url}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
    });
};

export const axiosLogin = async (url, data) => {
    try {
        const response = await axios.post(`${authURL}${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });

        // Store the token in local storage
        localStorage.setItem('token', response.data.token);

        return response;
    } catch (error) {
        throw error;
    }
};

export const axiosGetUser = (url) => {
    const resource = authURL + url;
    console.log(resource);

    return axios.get(resource, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
}

export const axiosDeleteToken = (url) => {
    return axios.delete(`${authURL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
};

export const axiosDelete = (url) => {
    return axios.delete(`${baseURL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
};

export const axiosPut = (url, data) => {
    return axios.put(`${baseURL}${url}`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
};