import axios from "axios";
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_START, REGISTER_SUCCESS } from "./actionTypes";
// Corrected login function
// const URL = `https://backend-dzjv.onrender.com`
const URL = `https://fine-planes-share.loca.lt`
export const loginFunction = (payload: any) => async (dispatch: any) => {
    dispatch({ type: LOGIN_START });
    try {
        const res = await axios.post(`${URL}/user/login`, payload);
        console.log(res.data);
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        return res.data;
    } catch (error) {
        console.log(error);
        dispatch({ type: LOGIN_FAILURE });
    }
};


export const registerFunction = (payload: any) => async (dispatch: any) => {
    dispatch({ type: REGISTER_START });
    try {
        const res = await axios.post(`${URL}/user/register`, payload);
        console.log(res.data);
        dispatch({ type: REGISTER_SUCCESS, payload: res.data.message });
        return res.data.message; // Return success message
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
        return Promise.reject(errorMessage); // Return error message as a rejected promise
    }
};


export const logoutFunction = () => async (dispatch: any) => {
    dispatch({ type: LOGOUT_SUCCESS });
};