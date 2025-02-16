import axios from "axios";
import { store } from "@/redux/store";
// const URL = "https://happy-clowns-remain.loca.lt" || process.env.EXPO_PUBLIC_API_URL
const URL = "https://long-hairs-bet.loca.lt"
export const axiosInstance = axios.create({
    baseURL: URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = (store?.getState() as any)?.auth?.userToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            store.dispatch({ type: "LOGOUT_SUCCESS" });
        }
        return Promise.reject(error)
    }
)