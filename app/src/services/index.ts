import Auth from "./authService";
import Inventory from "./inventoryService";

const token = localStorage.getItem("apiToken");

export const authServices = new Auth(token);
export const inventoryServices = new Inventory(token);
