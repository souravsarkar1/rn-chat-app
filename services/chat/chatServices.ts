import { axiosInstance } from "@/helpers/axiosInstance"

export const getAllChat = async (payload: any) => {
    try {
        const res = await axiosInstance.post(`/conversation/get-all-message`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const sendMessage = async (payload: any) => {
    try {
        const res = await axiosInstance.post(`/conversation/add-new-message`, payload);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getSingleFriendDetails = async (payload: any) => {
    try {
        const res = await axiosInstance.post(`/user/user-by-id`, payload);
        return res.data
    } catch (error) {
        throw error;
    }
}


export const getChatFriend = async (payload: any) => {
    try {
        const res = await axiosInstance.post("/conversation/get-friend", payload);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}