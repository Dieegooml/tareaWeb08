import api from "./api";

const register = (username, email, password, roles) => {
  return api.post("/auth/signup", {
    username,
    email,
    password,
    roles,
  });
};

const login = (username, password) => {
  return api
    .post("/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      return response.data;
    });
};

const logout = (refreshToken) => {
  return api.post("/auth/signout", { refreshToken }).then(() => {
    localStorage.removeItem("refreshToken");
  });
};

const getCurrentRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const authService = {
  register,
  login,
  logout,
  getCurrentRefreshToken,
};

export default authService;
