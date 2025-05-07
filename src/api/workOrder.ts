import { apiClient } from "./config";

export const apiGetAllWorkOrder = async (payload: any) => {
  const res = await apiClient.post("/work-order/list", payload);
  return res;
};

export const apiCreateWorkOrder = async (payload: any) => {
  const res = await apiClient.post("/work-order", payload);
  return res;
};

export const apiGetWorkOderById = async (payload: any) => {
  const res = await apiClient.get(`/work-order/${payload.id}`);
  return res;
};

export const apiUpdateWorkOderById = async (payload: any, id: string) => {
  const res = await apiClient.patch(`/work-order/${id}`, payload);
  return res;
};

export const apiGetWorkOrderByUser = async (payload: any) => {
  const res = await apiClient.get("/work-order/search/by-userId", payload);
  return res;
};
