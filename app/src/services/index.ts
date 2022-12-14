import Auth from "./authService";
import Inventory from "./inventoryService";
import Members from "./membersService";
import Reports from "./reportsServices";

export const authServices = new Auth();
export const inventoryServices = new Inventory();
export const membersServices = new Members();
export const reportServices = new Reports();
