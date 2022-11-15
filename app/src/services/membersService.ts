import HttpAdapter from "./httpAdapter";

class MembersService extends HttpAdapter {
  getMembers() {
    return this.get("/members");
  }

  getMemberById(userId: number) {
    return this.get(`/members/${userId}`);
  }

  updateMember(userId: number, data: any) {
    return this.post(`/members/update/${userId}`, data);
  }
}

export default MembersService;
