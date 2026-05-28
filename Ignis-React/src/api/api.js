export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    ///window.location.href = "/login";
  }

  return response;
};
