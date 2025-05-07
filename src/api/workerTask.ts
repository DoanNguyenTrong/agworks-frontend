import { apiClient } from "./config";

export const apiGetAllWorkerTask = async (payload: any) => {
  const res = await apiClient.post("/worker-tasks/list", payload);
  return res;
};