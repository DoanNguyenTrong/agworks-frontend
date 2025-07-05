import { apiClient } from "./config";

export const getAllWorkTypesByCreatedId = async (payload) => {
  const res = await apiClient.get('/work-type', payload);
  return res;
}

export const createWorkType = async (payload: any) => {
  return await apiClient.post("/work-type", payload);
};

export const updateWorkType = async (workTypeId: string, payload: any) => {
  return await apiClient.patch(`/work-type/${workTypeId}`, payload);
};

export const deleteWorkType = async (workTypeId: string) => {
  const res = await apiClient.delete(`/work-type/${workTypeId}`);
  return res;
}