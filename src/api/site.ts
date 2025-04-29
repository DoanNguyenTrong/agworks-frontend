import { apiClient } from "./config";

export const apiGetAllSite = async () => {
  const res = await apiClient.get("/site");
  return res;
};

export const apiGetSearchSiteByUser = async () => {
  const res = await apiClient.get("/site/search/by-user-id");
  return res;
};

export const apiGetDetailSite = async (id: string) => {
  const res = await apiClient.get(`/site/${id}`);
  return res;
};

export const apiCreateSite = async (payload: any) => {
  const res = await apiClient.post("/site", payload);
  return res;
};

export const apiUpdateSite = async (payload: any, id: string) => {
  const res = await apiClient.patch(`/site/${id}`, payload);
  return res;
};

export const apiUpdateByFieldUserIds = async (payload: any, id: string) => {
  const res = await apiClient.patch(
    `/site/update-field/userIds/${id}`,
    payload
  );
  return res;
};

export const apiDeleteSite = async (id: string) => {
  const res = await apiClient.delete(`/site/${id}`);
  return res;
};

export const apiGetListSite = async (payload: any) => {
  const res = await apiClient.post("/site/list", payload);
  return res;
};
