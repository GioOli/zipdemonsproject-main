const express = require("express");
bodyParser = require('body-parser');

const app = express();

const userRoute = require("./routes/user");
const loginRoute = require("./routes/login");
const adminRoute = require("./routes/admin");
const itemRoute = require("./routes/item");
const requestRoute = require("./routes/request");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoute);
app.use(loginRoute);
app.use(adminRoute);
app.use(itemRoute);
app.use(requestRoute);

app.use(express.json());

//if there is no environment variable set for port number
//use a default value of 3000
var port = process.env.PORT || 5000;
console.log("online port 5000")
app.listen(port)