import axios from "axios";
import type { NumerologyRequest, NumerologyResponse } from "../types/numerology";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1"
});

export const calculateNumerology = async (payload: NumerologyRequest) => {
  const { data } = await api.post<NumerologyResponse>("/numerology/calculate", payload);
  return data;
};

export const fetchHistory = async () => {
  const { data } = await api.get<NumerologyResponse[]>("/numerology/history");
  return data;
};
