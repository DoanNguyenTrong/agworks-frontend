import { apiClient } from "./config";

export const getAllRolesByOrganization = async () => {
  return await apiClient.get("/roles");
};

export const createRole = async (payload: any) => {
  return await apiClient.post("/roles", payload);
};

export const getRoleById = async (id: string) => {
  return await apiClient.get(`/roles/${id}`);
};

export const updateRole = async (id: string, payload: any) => {
  return await apiClient.patch(`/roles/${id}`, payload);
};

export const deleteRole = async (id: string) => {
  return await apiClient.delete(`/roles/${id}`);
};
