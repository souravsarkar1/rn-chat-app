import axios from "axios"


const url = 'http://192.168.0.106:3000'


export const singUp1 = async (payload: any) => {
    try {
        const response = await axios.post(`${url}/user/mobile/register`, payload)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}