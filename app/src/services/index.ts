import Auth from "./authService";
import Inventory from "./inventoryService";
import Members from "./membersService";
import Reports from "./reportsServices";
import Orders from "./ordersServices";
import Indicators from "./indicatorServices";
import Movement from "./movementServices";

export const authServices = new Auth();
export const inventoryServices = new Inventory();
export const membersServices = new Members();
export const reportServices = new Reports();
export const ordersServices = new Orders();
export const indicatorServices = new Indicators();
export const movementServices = new Movement();
