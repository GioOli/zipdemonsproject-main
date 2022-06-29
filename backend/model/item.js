const config = require("../config");
const jwt = require('jsonwebtoken');
const itemController = require("../controllers/item");
const LoginController = require("../controllers/login");
const userController = require("../controllers/user");
const activedirectory = require("../controllers/ActiveDirectory");
const fs = require('fs');
const ActiveDirectory = require('activedirectory');

//Gets the item details
exports.getItemDetail = async (req, res) => {

    try {
        let item;
        //Gets item details by -ID-
        if (req.query.id) {

            item = await itemController.getItemDetailById(parseInt(req.query.id));
            res.json(item);
        }


    } catch (err) {

        throw new Error(err);
    }
}



//Inserts an Item into the Database
//Requires on body an object named 'item' with expected data inside
//item: {
//name: ""
//price: ""
//category: ""
//sub_category: ""
//itemDetails: [{
//key: ""
//value: ""
//},
//{
//key: ""
//value: ""
//}]
//}
exports.insertItem = async (req, res) => {

    try {
        //console.log(req);
        var isManager = false;

        //Checks if user's token is valid
        var requester = jwt.verify(req.body.token, config.tokenSecret);
        //var isAuth = await activedirectory.authenticateUser(requester.email, requester.password); ACTIVE NOT WORKING TO CHANGE
        var isAuth = true;
        if (!isAuth) {
            res.sendStatus(401);
        }

        //Get User and check if it is a unit_manager
        var user = await userController.getUserByEmail(requester.email);
        if (!user.roles[0] === 'unit_manager') {
            console.log("User is not Unit Manager! - Can't add Item");
            res.sendStatus(404);
        }

        //Add Item
        let itemAddAnswer = await itemController.insertNewItem(req.body.item, user);
        res.json({ message: "Item Added Sucessfully" });



    } catch (error) {
        throw new Error(error);
    }
}
/**
 * Gets items that are requested by the user 
 * @param {*} req 
 * @param {*} res 
 */
exports.getLoans = async (req, res) => {
    try {
        var request = jwt.verify(req.header.token, config.tokenSecret);
        if (request) {
            var user = await userController.getUserByEmail(request.email);
            result = await itemController.getLoans(user);
            res.json(result);
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}
/**
 * gets all available and unavailable items
 * @param {*} req 
 * @param {*} res 
 */
exports.getAvailableAndUnavailableItems = async (req, res) => {
    console.log(req);
    try {
        var request = jwt.verify(req.headers.token, config.tokenSecret);
        console.log(request);
        if (request) {
            user = await userController.getUserByEmail(request.email);

            if (!user.roles[0] === 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");

                res.sendStatus(404);
                return
            }
            result = await itemController.getAvailableAndUnavailableItems(user);
            console.log(result)
            res.json(result);
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
        console.log(error)
        throw new Error(error);
    }
}
/**
 * Get item requests from the user
 * @param {*} req 
 * @param {*} res 
 */
exports.getRequests = async (req, res) => {
    try {
        var request = jwt.verify(req.headers.token, config.tokenSecret);
        if (request) {
            user = await userController.getUserByEmail(request.email);
            console.log(user)
            result = await itemController.getRequests(user);
            console.log(result)
            res.json(result);
        }
        else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}


exports.getInsertDynamic = async (req, res) => {

    try {
        let path = "backend/teste.json";


        //Get Categories in case it is not mentioned
        let category = "";
        if (req.query.category === null || req.query.category === undefined) {
            let file = fs.readFileSync(path);
            let json_result = await JSON.parse(file);
            let return_categories = [];
            for (i = 0; i < json_result.categorias.length; i++) {
                return_categories.push(json_result.categorias[i].nome);
            }
            res.json(return_categories);
            return;
        }
        category = req.query.category;


        //Get Sub_Categories from Category in case it is not mentioned
        let sub_category = "";
        if (req.query.sub_category === null || req.query.sub_category === undefined) {
            let file = fs.readFileSync(path);
            let json_result = await JSON.parse(file);
            let return_subcategories = [];
            for (i = 0; i < json_result.categorias.length; i++) {

                if (json_result.categorias[i].nome === category) {
                    for (ii = 0; ii < json_result.categorias[i].sub_categorias.length; ii++) {
                        return_subcategories.push(json_result.categorias[i].sub_categorias[ii].nome);
                    }
                    break;
                }

            }
            res.json(return_subcategories);
            return;
        }
        sub_category = req.query.sub_category;


        //Get Brand based on category and sub category in case it is not mentioned
        let brand = "";
        if (req.query.brand === null || req.query.brand === undefined) {
            let file = fs.readFileSync(path);
            let json_result = await JSON.parse(file);
            let return_brand = [];
            for (i = 0; i < json_result.categorias.length; i++) {

                if (json_result.categorias[i].nome === category) {
                    for (ii = 0; ii < json_result.categorias[i].sub_categorias.length; ii++) {

                        if (json_result.categorias[i].sub_categorias[ii].nome === sub_category) {
                            for (iii = 0; iii < json_result.categorias[i].sub_categorias[ii].marca_e_modelo[0].marca.length; iii++) {
                                return_brand.push(json_result.categorias[i].sub_categorias[ii].marca_e_modelo[0].marca[iii].nome);
                            }
                            break;
                        }

                    }
                    break;
                }

            }
            res.json(return_brand);
            return;
        }
        brand = req.query.brand;



        //Get Model Based on Brand in case models is set to true
        if (req.query.models !== null && req.query.models === "true") {
            let file = fs.readFileSync(path);
            let json_result = await JSON.parse(file);
            let modelos = [];
            for (i = 0; i < json_result.categorias.length; i++) {

                if (json_result.categorias[i].nome === category) {
                    for (ii = 0; ii < json_result.categorias[i].sub_categorias.length; ii++) {

                        if (json_result.categorias[i].sub_categorias[ii].nome === sub_category) {
                            for (iii = 0; iii < json_result.categorias[i].sub_categorias[ii].marca_e_modelo[0].marca.length; iii++) {

                                if (json_result.categorias[i].sub_categorias[ii].marca_e_modelo[0].marca[iii].nome === brand) {
                                    modelos = json_result.categorias[i].sub_categorias[ii].marca_e_modelo[0].marca[iii].modelo;
                                    break;
                                }
                            }
                            break;
                        }

                    }
                    break;
                }

            }
            res.json(modelos);
            return;
        }




        //Get all other data as JSON
        if (req.query.models === null || req.query.models === undefined || req.query.models === "false") {
            let file = fs.readFileSync(path);
            let json_result = await JSON.parse(file);
            let data = {};
            for (i = 0; i < json_result.categorias.length; i++) {

                if (json_result.categorias[i].nome === category) {
                    for (ii = 0; ii < json_result.categorias[i].sub_categorias.length; ii++) {

                        if (json_result.categorias[i].sub_categorias[ii].nome === sub_category) {

                            data = json_result.categorias[i].sub_categorias[ii];
                            if (data.nome !== null) {
                                delete json_result.categorias[i].sub_categorias[ii].nome;
                            }
                            if (data.marca_e_modelo !== null) {
                                delete json_result.categorias[i].sub_categorias[ii].marca_e_modelo;
                            }

                            break;
                        }

                    }
                    break;
                }

            }
            res.json(data);
            return;
        }

    } catch (error) {
        res.json(500);
        throw new Error(error);
    }
}

//Get categories from DB
exports.getCategories = async (req, res) => {
    try {
        let cats = await itemController.getCategories();
        res.json(cats);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

//Get sub-categories from DB
exports.getSubCategories = async (req, res) => {
    try {
        //console.log(req);
        let sub_cat = await itemController.getSubCategories(req.query.category);
        res.json(sub_cat);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

//Get brands from DB
exports.getBrands = async (req, res) => {
    try {
        let brands = await itemController.getBrands(req.query.category, req.query.sub_category);
        res.json(brands);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

//Get actives to return from DB
exports.getActivesReturns = async (req, res) => {
    try {
        let act_returns = await itemController.getActivesReturns();
        res.json(act_returns);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

exports.deprecateItem = async (req, res) => {
    try {
        var request = jwt.verify(req.headers.token, config.tokenSecret);
        if (request) {
            user = await userController.getUserByEmail(request.email);
            if (user.roles[0] !== 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");
                res.sendStatus(404);
            }
            console.log(req.body.itemsID)
            for (let i = 0; i < req.body.itemsID.length; i++)
                result = await itemController.deprecateItem(user, req.body.itemsID[i]);
            res.json({ "Result": result });
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

exports.activeHistory = async (req, res) => {
    try {
        console.log(req);
        var request = jwt.verify(req.headers.token, config.tokenSecret);
        if (request) {
            user = await userController.getUserByEmail(request.email);
            if (user.roles[0] !== 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");
                res.sendStatus(404);
            }
            console.log("here");
            item = await itemController.getItemDetailById(req.query.itemId)
            //console.log("oiii");
            if (item == {}) {
                res.sendStatus(404);
            }
            else {
                if (item.department_id !== user.department_id) {
                    res.sendStatus(404);
                }
                else {
                    result = await itemController.activeHistory(item);
                    console.log(result);
                    res.json(result);
                }
            }
        }
        else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}



//Return an active (By David)
exports.returnActive = async (req, res) => {
    try {

        var request = jwt.verify(req.body.token, config.tokenSecret);
        if (request) {
            var user = await userController.getUserByEmail(request.email);
            if (user.roles[0] !== 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");
                res.sendStatus(404);
            }
            for (let i = 0; i < req.body.itemsID.length; i++)
                await itemController.returnActive(user.id, req.body.itemsID[i]);
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

exports.requestReturn = async (req, res) => {
    //console.log(req);
    try {

        let decryptToken = jwt.verify(req.body.token, config.tokenSecret);

        let user = await userController.getUserByEmail(decryptToken.email);
        //Item ID to return cannot be empty
        if (req.body.id === null || req.body.id === undefined || Array.isArray(req.body.id) === false) {
            console.log("Item ID cannot be empty OR needs to be an Array");
            res.sendStatus(400);
            return;
        }
        var itemId = req.body.id;
        var availableItemIds = [];

        for (p = 0; p < itemId.length; p++) {
            //Verify if User actually currently holds the item
            var holderId = await itemController.getItemOwner(itemId[p]);
            if (holderId !== user.id) {
                console.log("User " + user.displayname + " does not currently hold the item: " + itemId[p] + ". Cannot create return request. It belongs to: " + holderId);
                continue;
            }

            //Then verify if there is an itemrequest unresolved for the item and the user
            var hasPendingRequestForItem = await itemController.isTherePendingItemReturnRequestByUserForItem(user, itemId[p]);
            if (hasPendingRequestForItem) {
                console.log("User " + user.displayname + " can't start ANOTHER Item return Request. There is one Request pending approval for the Item: " + itemId[p] + " By the User.");
                continue;
            }
            availableItemIds.push(itemId[p]);
        }

        //If it holds, add Request
        for (p = 0; p < availableItemIds.length; p++) {
            await itemController.insertItemReturnRequest(availableItemIds[p], user);
        }

        return res.sendStatus(200);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error)
    }
}

exports.itemBreakdown = async (req, res) => {
    try {

        var request = jwt.verify(req.headers.token, config.tokenSecret);
        if (request) {
            var user = await userController.getUserByEmail(request.email);
            if (user.roles[0] !== 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");
                res.sendStatus(404);
            }
            console.log(req.body.itemsID.length);
            for (let i = 0; i < req.body.itemsID.length; i++) {
                var result = await itemController.itemBreakdown(user, req.body.itemsID[i]);
                if (result == "error") {
                    res.sendStatus(500);
                }
            }
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }


    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}

exports.itemFix = async (req, res) => {
    try {

        var request = jwt.verify(req.headers.token, config.tokenSecret);
        if (request) {
            var user = await userController.getUserByEmail(request.email);
            if (user.roles[0] !== 'unit_manager') {
                console.log("User is not Unit Manager! - Can't check available item");
                res.sendStatus(404);
            }
            for (let i = 0; i < req.body.itemsID.length; i++) {
                var result = await itemController.itemFix(req.body.itemsID[i]);
                if (result == "error") {
                    res.sendStatus(500);
                }
            }
            res.sendStatus(200);

        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}


//Get labels and details from DB
exports.getLabelDetails = async (req, res) => {
    try {
        console.log(req.query)
        let labels_details = await itemController.getLabelDetails(req.query.category, req.query.sub_category);
        res.json(labels_details);

    } catch (error) {
        res.sendStatus(500);
        throw new Error(error);
    }
}
