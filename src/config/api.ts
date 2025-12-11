import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const orginalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !orginalRequest._retry &&
            !orginalRequest.url?.includes("/auth/refresh")
        ) {
            orginalRequest._retry = true;

            try {
                await api.post("/auth/refresh");
                return api(orginalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
