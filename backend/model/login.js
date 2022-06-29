
const userController = require("../controllers/user");

const config = require("../config");
const jwt = require('jsonwebtoken');
const ActiveDirectory = require('activedirectory');
//const activedirectory = require("../controllers/ActiveDirectory");


//Autentica, obtem os dados do utilizador, insere ou atualiza
//os dados na base de dados. Caso haja um erro em algum destes
//processos devolve FALSE.
exports.adAuth = async (req, res) => {
    console.log("Entrei")
    console.log(req.body)

    var createdToken;

    //criar template
    var userSlim = {
        id: 0,
        statusCode: 200,
        email: req.body.id,  //é o email
        displayname: "user",
        token: createdToken,
        roles: []
    };

    //Verificar se ultilizador existe na base de dados
    var userExists = await userController.userExistsByEmail(userSlim.email);
    var userData = userSlim;

    if (userExists) {
        //console.log("Account with email: " + req.body.id + " exists in our Database. No creation needed.");
        userData = await userController.getUserByEmail(userSlim.email);
        console.log(userData)
    } else {

        //console.log("Account with email: " + req.body.id + " dont exists in our Database.");
        return res.sendStatus(401);
    }


    //Apos sucesso, cria token
    createdToken = await jwt.sign({ email: req.body.id, password: req.body.password }, config.tokenSecret);
    //let createdToken = await jwt.sign({email: req.body.username, password: req.body.password}, config.tokenSecret,{expiresIn: '1h'});
    console.log(createdToken)


    //Update userSlim with the ID, role and username
    userSlim.id = userData.id;
    userSlim.roles = await userController.getUserRoleById(userData.id);
    userSlim.displayname = userData.displayname
    userSlim.token = createdToken

    //DEVOLVE OS DADOS DO USER AO FRONTEND
    console.log(userSlim)
    return res.json(userSlim);

    try {
        /* var ad = new ActiveDirectory(config.configAd);
         if (!userExists(req.body.id)) {
             return res.sendStatus(401);
         }*/
        /*ad.authenticate(req.body.id, req.body.password, async function (err, auth) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                //return res.sendStatus(401);
            }*/

        //if (auth) {
        //console.log('Authenticated!');

        var createdToken;

        //criar template
        var userSlim = {
            id: 0,
            statusCode: 200,
            email: req.body.id,  //é o email
            displayname: "user",
            token: createdToken,
            roles: []
        };

        //Verificar se ultilizador existe na base de dados
        var userExists = await userController.userExistsByEmail(userSlim.email);
        var userData = userSlim;

        if (userExists) {
            //console.log("Account with email: " + req.body.id + " exists in our Database. No creation needed.");
            userData = await userController.getUserByEmail(userSlim.email);
            console.log(userData)
        } else {

            //console.log("Account with email: " + req.body.id + " dont exists in our Database.");
            return res.sendStatus(401);
        }


        //Apos sucesso, cria token
        createdToken = await jwt.sign({ email: req.body.id, password: req.body.password }, config.tokenSecret);
        //let createdToken = await jwt.sign({email: req.body.username, password: req.body.password}, config.tokenSecret,{expiresIn: '1h'});
        console.log(createdToken)


        //Update userSlim with the ID, role and username
        userSlim.id = userData.id;
        userSlim.roles = await userController.getUserRoleById(userData.id);
        userSlim.displayname = userData.displayname
        userSlim.token = createdToken

        //DEVOLVE OS DADOS DO USER AO FRONTEND
        console.log(userSlim)
        return res.json(userSlim);
        //}
        /*else {
            console.log('Authentication failed!');
            return res.sendStatus(401);
        }*/
        //});

    } catch (error) {
        throw new Error(error);
    }

};

/**
 * Verify if user exists in a group of users.
 * @param {*} email 
 * @returns false if users doesn't exists and true if it exists.
 */
function userExists(email) {
    var ad = new ActiveDirectory(config.configAd);
    ad.isUserMemberOf(email, config.adGroupName, function (err, isMember) {
        if (err) {
            //console.log('ERROR: ' +JSON.stringify(err));
            return false;
        }
    });
    return true;
}