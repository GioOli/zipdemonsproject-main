const express = require("express");
const router = express.Router();

const loginModel = require("../model/login");

router.post("/login", loginModel.adAuth);




module.exports = router;