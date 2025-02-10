import axios from "axios";
import API_BASE_URL from "../config/api";

const api = axios.create({
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
