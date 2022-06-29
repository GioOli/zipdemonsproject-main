const activeDirectory = require("activedirectory");
const { result } = require("underscore");
const { configAd } = require("../config");
const ad = new activeDirectory(configAd);
const jwt = require('jsonwebtoken');

const Pool = require("pg").Pool;
const config = require("../config");

const pool = new Pool(config.configdB);
const secretJwtKey = require("../config").tokenSecret;



//https://www.npmjs.com/package/activedirectory#authenticate


//Obtém resultados do AD Authenthication, devolve bool:
//  true:   autenticação bem sucedida
//  false:  autenticação falhada
exports.adAuth = async (user) => {

    try {

        let answer;
        //Autenticar e receber resposta com api call
        return await ad.authenticate(user.email, user.password, function (err, auth) {
            if (err) {
                throw new Error(error);
            }
            if (auth) {
                console.log("Authentication: successfull");
                answer = true;
                //return true;
            }
            else {
                console.log("Authentication: Failed");
                answer = false;
                //return false;
            }
        })(answer)

        return answer;

    } catch (error) {
        console.log("AD error");
        throw new Error(error);
    }
};


//Pede ao Active Directory pelos dados do utilizador:
//  Objecto:    {
//      userPrincipalName, 
//      sAMAccountName, 
//      mail, 
//      lockoutTime, 
//      whenCreated, 
//      pwdLastSet, 
//      userAccountControl, 
//      employeeID, 
//      sn, 
//      givenName, 
//      initials, 
//      cn, 
//      displayName, 
//      comment, 
//      description
//  }
//  false:  operação falhada
exports.findUser = async (email) => {
    let user = await client.query(`SELECT * FROM Person WHERE email='${email}'`);
    try {
        let result;
        result = await ad.findUser(email, function (err, user) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                throw new Error(err);
            }

            if (!user) {
                console.log('User: ' + email + ' not found.');
                result = false;
                return false;
            }
            else {
                result = user;
                return user;
            }
        })(result)

        return result;

    } catch (error) {
        throw new Error(error);
    }

}




//Obtém resultados do AD Authenthication, devolve bool:
//  true:   autenticação bem sucedida
//  false:  autenticação falhada
exports.authByToken = async (token) => {

    try {

        let receivedValues = jwt.verify(token, secretJwtKey);
        let answer;
        //Autenticar e receber resposta com api call
        answer = await ad.authenticate(receivedValues.email, receivedValues.password, function (err, auth) {
            if (err) {
                throw new Error(error);
            }
            if (auth) {
                console.log("Authentication: successfull");
                answer = true;
                return true;
            }
            else {
                console.log("Authentication: Failed");
                answer = false;
                return false;
            }
        })(answer)

        return answer;

    } catch (error) {
        throw new Error(error);
    }
};