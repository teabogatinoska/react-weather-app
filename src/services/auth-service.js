import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", { username, password }, {
      headers: {
        "Accept": "application/json", 
      },
    })
    .then((response) => {
      
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      
      } else {
        console.error("Token is missing in the response");
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Login error: ", error);
    });
};


const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  console.log("Local storage: ", localStorage);
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;