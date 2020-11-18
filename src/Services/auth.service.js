import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
class AuthService {
  /***********************************Register******************* */
  register(data) {
    return axios.post(API_URL + "/api/user/", data).then((response) => {
      if (response) {
      }

      return response;
    });
  }
  /***********************************Login********************* */
  login(data) {
    return axios
      .post(API_URL + "/api/login/", data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response && response.data && response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response;
      });
  }

  /***********************************Get User******************* */

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
