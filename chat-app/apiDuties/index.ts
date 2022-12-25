import axios from "axios";
import { Buffer } from "buffer";

//* If it not work then paste the url over here
const api = axios.create({
    baseURL: process.env.API_BASE_URL
});

interface userInfo {
    username: string;
    email: string;
    password: string;
}

interface verifyUserInfo {
    username: string;
    password: string;
}

//* routes

export const saveTheUser = async (user: userInfo) => {
    const res = await api.post('/auth/user-signup', user);
    return res.data;
};

export const verifyTheUser = async (user: verifyUserInfo) => {
    const res = await api.post('/auth/user-login', user);
    return res.data;
}

export const getTheAvatars = async (n: number) => {
    let data = [];

    try 
    {
        for (let i = 0; i < n; i++) {
            let image = await axios.get(`https://api.multiavatar.com/${Math.round(Math.random() * 10000)}`);
            let buffer = Buffer.from(image.data);
            data.push(`data:image/svg+xml;base64,${buffer.toString('base64')}`);
        }
    }
    catch (error) 
    {
        console.log(error);
        // window.location.reload();
    }

    return data;
}

export const saveTheAvatar = async (avatarImage: string, userId:string) => {

    try 
    {
        let response = await api.put('/auth/avatar-setup',
        {
            avatarImage, 
            userId
        });

        return response.data;
    } 
    catch (error) {
        console.log(error);
    }

}

export const getAllUsers = async (id:string) => {

    try 
    {
        let response = await api.get(`/auth/users-list/${id}`);
        return response.data;
    } 
    catch (error) {
        console.log(error);
    }

}

export const addMessage = async (userMessage:any) => {

    try 
    {
        let chat = await api.post('/auth/add-msg', userMessage);
        return chat.data.success ? true : false;
    } 
    catch (error) 
    {
        console.log(error);
    }

}

export const getMessages = async (userId:any) => {

    try 
    {
        let chat = await api.post('/auth/get-msg', userId);
        return chat.data;
    } 
    catch (error) 
    {
        console.log(error);
    }

}



