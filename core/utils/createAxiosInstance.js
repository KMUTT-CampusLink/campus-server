import axios from "axios";
const createAxiosInstance = (bearerToken) => {
  return axios.create({
    baseURL: process.env.API_ENDPOINT,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    withCredentials: true,
  });
};

export default createAxiosInstance;
