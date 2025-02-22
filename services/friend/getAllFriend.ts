import { axiosInstance } from "@/helpers/axiosInstance";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const getMe = async () => {
    try {
        const res = await axiosInstance.post('/user/me');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};


export const getAllSuggestedFriends = async () => {
    try {
        const res = await axiosInstance.post('/user/get-all-suggested-friends');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};


export const sendFriendRequest = async (paylaod: any) => {
    try {
        const res = await axiosInstance.post('/user/friend-request', paylaod);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};


export const getAllFriend = async () => {
    try {
        const res = await axiosInstance.post('/user/get-friend');
        return res.data;
    } catch (error) {
        console.log(error);
    }
}