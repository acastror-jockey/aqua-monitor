import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  return response.data;
};


export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token");

  const response = await api.get("/auth/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export default api;
