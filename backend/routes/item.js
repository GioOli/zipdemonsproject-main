const express = require("express");
const router = express.Router();

const itemModel = require("../model/item");

//Gets an Item info
router.get("/item", itemModel.getItemDetail);

//Inserts an Item
router.post("/item/insert", itemModel.insertItem);

//Gets insert categories, subcategories and so on...
router.get("/item/options", itemModel.getInsertDynamic);

//Gets loans and requests done by 
router.get("/itemLoans", itemModel.getLoans);

//get items available and unavailable
router.get("/manageactives", itemModel.getAvailableAndUnavailableItems);

//requests feitos pelo utilizador assim como o seu estado
router.get("/requests", itemModel.getRequests);

//Gets categories from DB
router.get("/getCategories", itemModel.getCategories);

//Gets categories from DB
router.get("/getSubCategories", itemModel.getSubCategories);

//Gets categories from DB
router.get("/getBrands", itemModel.getBrands);

//Gets labels and details from DB
router.get("/getLabelDetails", itemModel.getLabelDetails);

//Gets actives to return
router.get("/actives/returns", itemModel.getActivesReturns);
/**
 * deprecates an item
 */
router.put("/deprecateItem", itemModel.deprecateItem);

/**
 * gets history related to the item
 */
router.get("/activeHistory", itemModel.activeHistory);
/* 
* return an active
 */
router.post("/returnActive", itemModel.returnActive);
//Inserts a Return Request
router.post("/item/returnrequest", itemModel.requestReturn);

router.post("/itemBreakdown", itemModel.itemBreakdown);

router.put("/itemFix", itemModel.itemFix);

module.exports = router;