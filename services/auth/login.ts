import axios from "axios"

// const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const url = 'https://quick-laws-wash.loca.lt'
export const login = async (payload: any) => {
    try {
        console
        const response = await axios.post(`${url}/user/login`, payload)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

