import { apiClient } from "./config";

export const apiGetAllBlock = async () => {
    const res = await apiClient.get('/block');
    return res;
}

export const apiGetDetailBlock = async (id: string) => {
    const res = await apiClient.get(`/block/${id}`);
    return res;
}

export const apiCreateBlock = async (payload: any) => {
    const res = await apiClient.post('/block', payload);
    return res;
}

export const apiUpdateBlock = async (payload: any, id: string) => {
    const res = await apiClient.patch(`/block/${id}`, payload);
    return res;
}

export const apiDeleteBlock = async (id: string) => {
    const res = await apiClient.delete(`/block/${id}`);
    return res;
}

export const apiGetListBlock = async (payload: any) => {
    const res = await apiClient.post('/block/list', payload);
    return res;
}


export const apiGetBlockByFiled = async (params: any) => {
    const res = await apiClient.get('/block/search/field', params);
    return res;
}
