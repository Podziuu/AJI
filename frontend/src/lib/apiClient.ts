import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

interface RefreshResponse {
  accessToken: string;
}

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.log("Błąd podczas sprawdzania ważności tokenu:", err);
    return true;
  }
}

apiClient.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");

  if (isTokenExpired(accessToken)) {
    try {
      const response = await refreshClient.post<RefreshResponse>(
        "/auth/refresh"
      );
      accessToken = response.data.accessToken;

      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      console.error("Błąd podczas odświeżania tokena:", error);
      throw error;
    }
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const response = await refreshClient.post<RefreshResponse>(
          "/auth/refresh"
        );
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient.request(error.config);
      } catch (err) {
        console.error("Błąd podczas odświeżania tokena:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
