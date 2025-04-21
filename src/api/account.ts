import { apiClient } from "./config";

export const apiLogin = async (payload: any) => {
    const res = await apiClient.post('/auth/login', payload);
    return res;
}