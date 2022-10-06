import HttpAdapter from "./httpAdapter";

class Csrf extends HttpAdapter {
  getToken() {
    return this.get("/sanctum/csrf-cookie");
  }
}

const csrf = new Csrf();
export default csrf;
