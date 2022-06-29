const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

const userModel = require("../model/user");

//get Token's user data
router.get("/user/user_profile", userModel.getByEmail);
//get user data (from query)
router.get("/user", userModel.getById);
//get user ordered items
router.get("/myitems", userModel.getUserItems);
//Retornar os itens em espera pedidos pelo utilizador
router.get("/myrequests",userModel.getMyRequests);
//Inserir Item request
router.post("/user/request", userModel.insertRequest);
/**
 * historico de ativos de um utilizador
 */
router.get("/user/user_history", userModel.getUserHistory);

module.exports = router;