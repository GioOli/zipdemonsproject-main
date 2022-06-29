const express = require("express");
const router = express.Router();

const requestModel = require("../model/request");

//Responder a um Request
router.post("/request/answer", requestModel.answerRequest);

//Get Requests from a Department
router.get("/unitrequests", requestModel.getDepartmentRequests);

//Get Requests by ID on query
router.get("/request", requestModel.getRequestById);


module.exports = router;