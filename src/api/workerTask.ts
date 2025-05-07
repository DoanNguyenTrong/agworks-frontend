import { apiClient } from "./config";

export const apiGetAllWorkerTask = async (payload: any) => {
  const res = await apiClient.post("/worker-tasks/list", payload);
  return res;
};

export const apiChangeStatusTask = async (payload: any, id: string) => {
  const res = await apiClient.patch(
    `/worker-tasks/change-status/${id}`,
    payload
  );
  return res;
};

export const apiGetTaskDetails = async (taskId: string) => {
  const res = await apiClient.get(`/worker-tasks/${taskId}`);
  return res;
};

export const apiGetWorkerTasksById = async () => {
  const res = await apiClient.get(`/worker-tasks`);
  return res;
};
