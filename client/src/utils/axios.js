import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:5000/v1/api"
      : "/v1/api",
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
