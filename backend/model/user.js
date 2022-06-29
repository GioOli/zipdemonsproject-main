const userController = require("../controllers/user");
const loginController = require("../controllers/login");

const config = require("../config");
const jwt = require("jsonwebtoken");
const activedirectory = require("../controllers/ActiveDirectory");
const ActiveDirectory = require("activedirectory");

exports.getById = async (req, res) => {
  try {
        let decryptToken = jwt.verify(req.body.token, config.tokenSecret);
        var ad = new ActiveDirectory(config.configAd);

        let user = await userController.getUserByEmail(decryptToken.email);
        if (user.roles[0] !== "administrator") {
            return res.sendStatus(401);
        }
        //Logica para pedir dados ao model e processar
        if (req.query.id === null || req.query.id === undefined) {
            res.sendStatus(400);
            return;
        }
        let answer = await userController.getUserById(req.query.id);
        return res.json(answer);

    } catch (error) {
        throw new Error(error)
    }
};

exports.getByEmail = async (req, res) => {
  try {
    let decryptToken = jwt.verify(req.headers.token, config.tokenSecret);
    if (decryptToken) {
      let answer = await userController.getUserByEmail(decryptToken.email);
      res.json(answer);
      return;
    }
    res.sendStatus(401);
    return;
  } catch (error) {
    throw new Error(error);
  }
};

exports.insertUser = async (req, res) => {
  //Logica para inserir na base de dados
  if (req.body.user === null || req.body.user === undefined) {
    res.sendStatus(400);
    return;
  }
  let answer = await userController.insertUser(req.body.user);
  res.json(answer);
};

//Get user items
exports.getUserItems = async (req, res) => {
  if (req.headers.token === null || req.headers.token === undefined) {
    res.sendStatus(401);
    return;
  }

  let verifiedToken = jwt.verify(req.headers.token, config.tokenSecret);
  console.log(verifiedToken);

  //Verificar Token
  //let tokenValid = await activedirectory.authenticateUser(verifiedToken.email, verifiedToken.password);  //AD TO BE FIXED
  let tokenValid = true;
  if (!tokenValid) {
    res.sendStatus(401);
    return;
  } else {
    //Extract user
    let exists = await userController.getUserByEmail(verifiedToken.email);
    console.log("User exists?: " + exists);
    if (!exists) {
      res.sendStatus(404);
    } else {
      let parametro;
      if (req.query.quantify === "true") {
        parametro = true;
      } else {
        parametro = false;
      }
      let items = await userController.getUserItems(exists, parametro);
      res.json(items);
    }
  }
};

//Inserts an Item Request
exports.insertRequest = async (req, res) => {
  try {
    console.log(req);
    if (req.body.token === null || req.body.token === undefined) {
      console.log("NO TOKEN PROVIDED!");
      return res.sendStatus(400);
    }
    let clearToken = jwt.verify(req.body.token, config.tokenSecret);
    //let auth = activedirectory.authenticateUser(clearToken.email, clearToken.password); ACTIVE NOT WORKING TO CHANGE
    let auth = true;
    if (!auth) {
      res.sendStatus(401);
      return;
    }

    //create request
    let answer = userController.insertUserRequest(
      req.body.pedido,
      clearToken.email
    );
    if (!answer) {
      res.sendStatus(401);
      return;
    }

    res.sendStatus(200);
  } catch (error) {
    throw new Error(error);
  }
};

//exports.getUserItems = async(req,res)=>{
//    res.json(userController.getPendingRequests())
//}?

exports.getMyRequests = async (req, res) => {
  try {
    var request = jwt.verify(req.headers.token, config.tokenSecret);
    if (request) {
      var items = await userController.getPendingRequests(true);
      res.json(items)
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
}

exports.getUserHistory = async (req, res) => {
  try {
    var request = jwt.verify(req.headers.token, config.tokenSecret);
    if (request) {
      var user = await userController.getUserByEmail(request.email);
      var history = await userController.getUserHistory(user);
      if (history == { "Error": "Fail" }) {
        res.sendStatus(404);
      }
      else {
        res.json(history);
      }
    }
    else {
      res.sendStatus(404);
    }
  }
  catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
}
/*
exports.verifyJWT= async(req,res,next)=>{
    let token = jwt.verify(req.header("token"));
    if (!token) {
        return res.sendStatus(401).json({ auth: false, message: 'Token não disponibilizado' })
    }
    jwt.verify(token, process.env.tokenSecret, function (err, decoded) {
        if (err) {
            return res.sendStatus(500).json({ auth: false, message: 'Token não autenticado' })
        }
        req.id=decoded.id
        next();
    })
}
*/


//just one comment to test the commit withou node modules
