export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`http://localhost:8080${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};
