import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAILURE, REGISTER_START, REGISTER_SUCCESS } from "./actionTypes";

const initialState = {
    isAuthenticated: false,
    userToken: "",
    user: null,
    loginIsLoading: false,
    loginIsError: false,
    signupIsLoading: false,
    signupIsError: false,
    signupMessage: '',


};

export const authenticationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOGIN_START:
            return {
                ...state,
                isAuthenticated: false,
                userToken: null,
                loginIsLoading: true,
                loginIsError: false
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                userToken: action.payload?.token,
                loginIsLoading: false,
                loginIsError: false,
                user: action.payload?.user
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                userToken: null,
                loginIsLoading: false,
                loginIsError: true
            }

        case REGISTER_START:
            return {
                ...state,
                signupIsLoading: true,
                signupIsError: false,
                signupMessage: '',
            }

        case REGISTER_SUCCESS:
            return {
                ...state,
                signupIsLoading: false,
                signupIsError: false,
                signupMessage: action.payload,
            }
        case REGISTER_FAILURE:
            return {
                ...state,
                signupIsLoading: false,
                signupIsError: true,
                signupMessage: action.payload,
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                userToken: null,
                user: {},
            }

        default:
            return state;
    }

}