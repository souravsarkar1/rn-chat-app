import axios from "axios"

export const homeContent = async (pyload: any) => {
    try {
        const res = await axios.get(`https://www.reddit.com/r/memes/top.json?limit=${pyload.limit}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}