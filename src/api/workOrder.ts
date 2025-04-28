import { apiClient } from "./config";

export const apiGetAllWorkOrder = async () => {
    const res = await apiClient.get('/work-order');
    return res;
}


export const apiCreateWorkOrder = async (payload: any) => {
    const res = await apiClient.post('/work-order', payload);
    return res;
}
