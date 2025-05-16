import { apiClient } from "./config";

export const apiGetConfigSystem = async () => {
  const res = await apiClient.get("/config-system");
  return res;
};

export const apiUpdateConfigSystem = async (payload: any) => {
  const res = await apiClient.patch(`/config-system/${payload._id}`, payload);
  return res;
};

export const apiCreateConfigSystem = async (payload: any) => {
  const res = await apiClient.post("/config-system", payload);
  return res;
};
