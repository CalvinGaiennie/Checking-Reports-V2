const API_BASE_URL = import.meta.env.PROD
  ? "https://your-backend-url.onrender.com/api"
  : "/api";

export default API_BASE_URL;
