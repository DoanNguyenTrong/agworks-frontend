import { apiClient } from "./config";

export const apiLogin = async (payload: any) => {
    const res = await apiClient.post('/auth/login', payload);
    return res;
}

export const apiCreateAcc = async (payload: any) => {
    const res = await apiClient.post('/auth/signup', payload);
    return res;
}