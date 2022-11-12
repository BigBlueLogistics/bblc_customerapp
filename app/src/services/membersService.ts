import HttpAdapter from "./httpAdapter";

class MembersService extends HttpAdapter {
  getMembers() {
    return this.get("/members");
  }

  getMemberById(id: number) {
    return this.get(`/members/${id}`);
  }
}

export default MembersService;
