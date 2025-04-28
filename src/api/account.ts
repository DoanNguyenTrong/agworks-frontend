import { apiClient } from "./config";

export const apiLogin = async (payload: any) => {
  return await apiClient.post("/auth/login", payload);
};

export const apiCreateAcc = async (payload: any) => {
  return await apiClient.post("/auth/signup", payload);
};

export const apiGetAccList = async (payload: any) => {
  return await apiClient.post("/auth/list", payload);
};

export const apiGetAllAccOrganization = async () => {
  return await apiClient.get("/auth/search/organizationId");
};

export const apiDeleteAcc = async (payload: any) => {
  return await apiClient.delete(`/auth/${payload?._id}`);
};

export const apiGetAccDetail = async (payload: any) => {
  return await apiClient.get(`/auth/${payload?.id}`, payload);
};

export const apiUpdateAcc = async (payload: any) => {
  return await apiClient.patch(`/auth/account/${payload._id}`, payload);
};

export const apiResetAcc = async (payload: any) => {
  return await apiClient.patch(
    `/auth/account/change_password/${payload?.id}`,
    payload
  );
};
