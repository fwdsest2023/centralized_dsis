import axios from "axios"
// import {dotenv} from 'dotenv'
// dotenv.config();
// check API Endpoint
const apiEndpoint = "http://8.219.180.176:8080/index.php/mlrs/api/v1/";
// const apiEndpoint = process.env.NODE_ENV === "production" ? 
// process.env.API_ENDPOINT_DEV : process.env.API_ENDPOINT_LOCAL;

// axios configuration
const myConfig = {
    baseURL: apiEndpoint,
    progress: false,
    headers: {
        common: {
            Accept: "*/*",
            "Content-Type": "application/json",
        }
    },
}

const api = axios.create(myConfig)

api.interceptors.request.use(function (config) {
    let appData = localStorage.getItem('token');
    const token = appData;
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});


export default api;
