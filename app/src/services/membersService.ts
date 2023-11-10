import HttpAdapter from "./httpAdapter";

class MembersService extends HttpAdapter {
  getMembers() {
    return this.get("/members");
  }

  getMemberById(userId: string) {
    return this.get(`/members/${userId}`);
  }

  updateMember(userId: string, data: any) {
    return this.post(`/members/update/${userId}`, data);
  }
}

export default MembersService;
