import { urls } from "config";
import Auth from "./authService";
import Inventory from "./inventoryService";
import Members from "./membersService";
import Reports from "./reportsServices";
import Orders from "./ordersServices";
import Indicators from "./indicatorServices";
import Movement from "./movementServices";
import TrucksVans from "./trucksVansService";
import Profile from "./profileService";

const { bwmsApiUrl } = urls();

export const authServices = new Auth();
export const inventoryServices = new Inventory();
export const membersServices = new Members();
export const reportServices = new Reports();
export const ordersServices = new Orders(bwmsApiUrl);
export const indicatorServices = new Indicators();
export const movementServices = new Movement();
export const trucksVansServices = new TrucksVans();
export const profileServices = new Profile();
