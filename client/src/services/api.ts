import axios from "axios";
import type { NumerologyRequest, NumerologyResponse } from "../types/numerology";
import type { GridContent, GridType } from "../types/gridContent";
import { getAdminToken } from "../utils/adminAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1"
});

const adminAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const calculateNumerology = async (payload: NumerologyRequest) => {
  const { data } = await api.post<NumerologyResponse>("/numerology/calculate", payload);
  return data;
};

export const fetchHistory = async () => {
  const { data } = await api.get<NumerologyResponse[]>("/numerology/history");
  return data;
};

export const fetchGridContentAll = async () => {
  const { data } = await api.get<GridContent[]>("/admin/grid-content");
  return data;
};

export const createGridContent = async (payload: {
  gridType: GridType;
  number: number;
  englishContent: string;
  hindiContent: string;
}) => {
  const { data } = await api.post<GridContent>("/admin/grid-content", payload, {
    headers: adminAuthHeaders()
  });
  return data;
};

export const updateGridContent = async (
  id: string,
  payload: {
    gridType: GridType;
    number: number;
    englishContent: string;
    hindiContent: string;
  }
) => {
  const { data } = await api.put<GridContent>(`/admin/grid-content/${id}`, payload, {
    headers: adminAuthHeaders()
  });
  return data;
};

export const deleteGridContent = async (id: string) => {
  const { data } = await api.delete<{ message: string }>(`/admin/grid-content/${id}`, {
    headers: adminAuthHeaders()
  });
  return data;
};
