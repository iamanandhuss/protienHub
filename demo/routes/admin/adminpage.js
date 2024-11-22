import {
  dashboard,
  allProducts,
  orderList,
  productDetails,
  add_products,
  view_banner,
  view_categories,
  view_coupons,
  view_users,
} from "../../controllers/admin/adminpage.js";
import express from "express";
const adminpage = express.Router();

adminpage.get("/adminpage", dashboard);
////
adminpage.get("/view_all_products", allProducts);
adminpage.get("/view_order_list", orderList);

adminpage.get("/view_product_details/:id", productDetails);
 
adminpage.get("/add_products", add_products);

adminpage.get("/view_banner", view_banner);

adminpage.get("/view_categories", view_categories);

adminpage.get("/manage_coupons", view_coupons);

adminpage.get("/manage_users", view_users);

export default adminpage;
 