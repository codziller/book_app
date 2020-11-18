import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
class UserService {
  /********************Retrive current user from localstorage ********************/
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  /********************Post user data ********************/
  async formSubmit(data, url) {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    return axios
      .post(API_URL + url, data, {
        headers: {
          Authorization:
            user && user.access_token ? `Bearer ${user.access_token}` : "",
        },
      })
      .then((response) => {
        if (response.data) {
          return response;
        }
      });
  }
  /********************Get user data ********************/
  async getInfo(data, url) {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    return axios
      .get(
        API_URL + url,

        {
          headers: {
            Authorization:
              user && user.access_token ? `Bearer ${user.access_token}` : "",
          },
        },
        data
      )
      .then((response) => {
        if (response.data) {
          return response;
        }
      });
  }

  /********************Patch user data ********************/
  async formPatch(data, url) {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);

    return axios
      .patch(API_URL + url, data, {
        headers: {
          Authorization:
            user && user.access_token ? `Bearer ${user.access_token}` : "",
        },
      })
      .then((response) => {
        if (response.data) {
          return response;
        }
      });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  /***********************************Delete User Info********************/
  async deleteInfo(url) {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    return axios.delete(
      API_URL + url,

      {
        headers: {
          Authorization:
            user && user.access_token ? `Bearer ${user.access_token}` : "",
        },
      }
    );
  }
}
export default new UserService();
