import axios from "axios"

// const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = 'http://localhost:3000'
export const login = async (payload: any) => {
    try {
        console
        const response = await axios.post(`${url}/user/login`, payload)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

