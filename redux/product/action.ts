import { axiosInstance } from "@/helpers/axiosInstance";
import { GET_PRODUCT_FAILURE, GET_PRODUCT_START, GET_PRODUCT_SUCCESS } from "./actionTypes";
export const getAllProduct = (payload: any) => async (dispatch: any) => {
    dispatch({ type: GET_PRODUCT_START });
    try {
        const res = await axiosInstance.get('/products', payload);
        console.log(res.data);

        dispatch({ type: GET_PRODUCT_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({ type: GET_PRODUCT_FAILURE });
    }
}