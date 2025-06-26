import axios from "axios";
import API_BASE_URL from "../config/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const response = await api.get("/forms");
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

//Form responses
export const postFormResponse = async (data) => {
  try {
    const response = await api.post("/form-responses", data);
    return response.data;
  } catch (error) {
    console.error("[API Service] Error posting form response:", error);
    console.error("[API Service] Error details:", error.response?.data);
    throw error;
  }
};

export const getFormResponses = async () => {
  try {
    const response = await api.get("/form-responses");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch form responses:", error);
    throw error;
  }
};

export const getMetrics = async (formName) => {
  try {
    const response = await api.get("/charts/" + formName);

    // The server now returns an array of field names directly
    const metrics = response.data;
    console.log(
      "METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS-METRICS",
      metrics
    );
    return metrics;
  } catch (error) {
    console.error("Failed to fetch form responses:", error);
    throw error;
  }
};
