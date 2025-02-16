import { GET_PRODUCT_FAILURE, GET_PRODUCT_START, GET_PRODUCT_SUCCESS } from "./actionTypes";

const initialState = {
    products: [],
    isProductLoading: false,
    isProductError: false
};

export const productReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_PRODUCT_START:
            return {
                ...state,
                isProductLoading: true,
                isProductError: false
            };
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.payload,
                isProductLoading: false,
                isProductError: false
            };

        case GET_PRODUCT_FAILURE:
            return {
                ...state,
                isProductLoading: false,
                isProductError: true
            };

        default:
            break;
    }
}