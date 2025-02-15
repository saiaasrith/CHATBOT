import constants from "../config/constants.js";

class ApiService {

  static post(endpoint, data) {
    return this.makeHttpRequest(endpoint, 'POST', data);
  }

  static async makeHttpRequest(endpoint, method, data) {
    try {
      const response = await fetch(`${constants.APP_URL}/api/v1/${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return response.json();
    } catch (error) {
      return error;
    }
  }

}

export default ApiService;
