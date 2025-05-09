import { apiClient } from "./config";

export const apiGetAllImage = async (payload: any) => {
  const res = await apiClient.post("/upload-image/list", payload);
  return res;
};

export const apiUploadImage = async (payload: any) => {
  const res = await apiClient.post("/upload-image", payload);
  return res;
};