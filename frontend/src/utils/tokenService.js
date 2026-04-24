export const tokenService = {
    getAccessToken: () => localStorage.getItem("accessToken"),
  
    getRefreshToken: () => localStorage.getItem("refreshToken"),
  
    setTokens: (access, refresh) => {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    },
  
    clear: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  };