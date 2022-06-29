const config = require("../config");
const jwt = require("jsonwebtoken");
const itemController = require("../controllers/item");
const LoginController = require("../controllers/login");
const userController = require("../controllers/user");
const requestController = require("../controllers/request");
const { request } = require("express");
const ActiveDirectory = require("activedirectory");

//Gets the item details
exports.answerRequest = async (req, res) => {
  try {
    console.log("Reqbody Refuse:", req.body);
    //Get Token data
    let verifiedToken = jwt.verify(req.body.token, config.tokenSecret);

    //Authenthicate
    //let authAnswer = await activedirectory.authenticateUser(verifiedToken.email, verifiedToken.password); ACTIVE NOT WORKING TO CHANGE
    let authAnswer = true;
    if (!authAnswer) {
      res.sendStatus(401);
      return;
    }

    //Verify if it is a unit_manager
    let userData = await userController.getUserByEmail(verifiedToken.email);
    let userRole = await userController.getUserRoleById(userData.id);
    if (userRole === false || userRole.indexOf("unit_manager") === -1) {
      console.log("User cannot Accept/Decline requests - Not an Unit Manager!");
      res.sendStatus(401);
      return;
    }

    //verificar se o pedido associado, faz parte do mesmo departamento que o unit manager
    let request = await requestController.getRequestById(req.body.id);
    if (request === false) {
      console.log(
        "Request with request id of -" + req.body.id + "- does not exist!"
      );
      res.sendStatus(400);
      return;
    }
    console.log(userData.department_id);
    console.log(request.department_id);
    if (userData.department_id != request.department_id) {
      console.log(
        "Unit Manager cannot Accept/Refuse Request. Request is not currently set for their Department!"
      );
      res.sendStatus(401);
      return;
    }

    //Se as condições forem todas positivas..
    //Saber se é para aceitar ou recusar:
    let acceptRefuse = req.body.action;
    if (acceptRefuse == null || acceptRefuse == undefined) {
      console.log("Missing action attribute in body!");
      res.sendStatus(400);
      return;
    }

    //Se for para Aceitar
    if (acceptRefuse == "accept") {
      requestController.acceptRequestById(
        request.action_id,
        userData,
        req.body.item_ids
      );

      //Possivelmente devolve ativos disponiveis daquele departament? CALL HERE?
      res.sendStatus(200);
      return;
    }

    //Se for para recusar
    if (acceptRefuse == "refuse") {
      requestController.refuseRequest(request.action_id, userData);
      res.sendStatus(200);
      return;
    }
  } catch (err) {
    throw new Error(err);
  }
};

//Get All Request linked to a Department
exports.getDepartmentRequests = async (req, res) => {
  try {
    //verify token
    if (req.headers.token === null || req.headers.token === undefined) {
      console.log("NO TOKEN RECEIVED");
      return res.sendStatus(400);
    }

    //Get Token data
    let verifiedToken = jwt.verify(req.headers.token, config.tokenSecret);

    if (!verifiedToken) {
      res.sendStatus(401);
      return;
    }

    //Verify if user is an item_manager
    let user = await userController.getUserByEmail(verifiedToken.email);
    if (user.isGestor === false) {
      console.log(
        "Cant retrieve requests. User: " +
          user.email +
          " - NOT AN ITEM_MANAGER!"
      );
      res.sendStatus(401);
      return;
    }

    //Get Department Requests
    let requests = await requestController.getRequestsByDepartmentId(
      user.department_id
    );

    res.json(requests);
    return;
  } catch (error) {
    res.sendStatus(401);
    throw new Error(error);
  }
};

//Get All Request Data based on a Request ID
exports.getRequestById = async (req, res) => {
  try {
    //verify token
    if (req.headers.token === null || req.headers.token === undefined) {
      console.log("NO TOKEN RECEIVED");
      return res.sendStatus(400);
    }

    //Get Token data
    let verifiedToken = jwt.verify(req.headers.token, config.tokenSecret);
    if (!verifiedToken) {
      res.sendStatus(401);
      return;
    }

    //Verify id
    if (req.query.id === null || req.query.id === undefined) {
      console.log("NO ID RECEIVED ON URL");
      return res.sendStatus(400);
    }

    let requestId = parseInt(req.query.id);

    //Get Department Requests
    let request = await requestController.getRequestById(requestId);
    if (request) {
      res.json(request);
      return;
    }

    res.sendStatus(401);
    return;
  } catch (error) {
    throw new Error(error);
  }
};
