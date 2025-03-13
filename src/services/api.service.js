import axios from "axios";
import API_BASE_URL from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getData = async () => {
  try {
    const response = await api.get("/items");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    throw error;
  }
};

export const postData = async (data) => {
  try {
    console.log("Sending data to server:", data);
    const response = await api.post("/items", data);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

//Users
export const createUser = async (userData) => {
  try {
    console.log("Creating user:", userData);
    const response = await api.post("/users", userData);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    console.log("Attempting login:", userData);
    const response = await api.post("/users/login", userData);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

//Forms
export const createForm = async (formData) => {
  try {
    console.log("[API Service] Attempting to create form with data:", formData);
    const response = await api.post("/forms", formData);
    console.log(
      "[API Service] Server response for form creation:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("[API Service] Error in createForm:", error);
    console.error("[API Service] Error details:", error.response?.data);
    throw error;
  }
};

export const getForms = async () => {
  try {
    console.log("[API Service] Fetching forms from:", `${API_BASE_URL}/forms`);
    console.log("[API Service] Full config:", api.defaults);
    const response = await api.get("/forms");
    console.log("[API Service] Retrieved forms:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API Service] Error in getForms:", error);
    console.error("[API Service] Error details:", error.response?.data);
    console.error("[API Service] Request config:", error.config);
    throw error;
  }
};

//Charts
export const getCharts = async () => {
  try {
    const response = await api.get("/charts");
    return response.data;
  } catch (error) {
    console.error("Error in getChart:", error);
    throw error;
  }
};

export const createChart = async (chartData) => {
  try {
    console.log("Creating chart:", chartData);
    const response = await api.post("/charts", chartData);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createChart:", error);
    throw error;
  }
};

export const deleteChart = async (chartId) => {
  try {
    const response = await api.delete(`/charts/${chartId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteChart:", error);
    throw error;
  }
};

//Forms
export const getForm = async (formId) => {
  try {
    const response = await api.get("/forms/" + formId);
    return response.data;
  } catch (error) {
    console.error("Error in getForm:", error);
    throw error;
  }
};
