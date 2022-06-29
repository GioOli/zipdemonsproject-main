const ActiveDirectory = require('activedirectory');
require('dotenv').config();

//Active Directory Configuraion
const config = {
    url: "ldap://192.168.1.6:389",           // IP and Port  Ex: ldap://XXX.XXX.XXX.XXX:YYY
    baseDN: 'dc=deamons,dc=ipn,dc=pt',          // Domain
    username: 'administrador@deamons.ipn.pt',   // Username of the Administrator of the Windows Server
    password: 'Pass12345'                       // Password of the Administrator of the Windows Server
    //url: process.env.AD_URL,
    //baseDN: process.env.AD_BASEDN,
    //username: process.env.AD_USERNAME,
    //password: process.env.AD_PASSWORD
}

const groupName = "AtivosIPN"
let flag = false;
//const groupName = process.env.AD_USERS_GROUP_NAME;    // Name of the group that contanins the users of the IPNAtivos Application

/**
 * Authenticate a user.
 * Return true if user exists and email and password are both correct.
 * Return false if user doesn't exists or if the email or password are incorrect.
 * @param {*} email 
 * @param {*} password 
 */
async function authenticateUser(email, password){
    console.log(email);
    console.log(password);
    var ad = new ActiveDirectory(config);
    //if(!userExists(email)){
    //    return false;
    //}
    let variavel = true;
    let answer = await ad.authenticate(email, password, variavel = function(err, auth) {
        if (err) {
          console.log('ERROR: '+JSON.stringify(err));
          flag = false;
          return false;
        }
        
        if (auth) {
          console.log('Authenticated!');
          flag = true;
          return true;
        }
        else {
          console.log('Authentication failed!');
          flag = false;
          return false;
        }
    })(flag);

    console.log(variavel);
    return variavel;
}

/**
 * Verify if user exists in a group of users.
 * @param {*} email 
 * @returns false if users doesn't exists and true if it exists.
 */
function userExists(email){
    var ad = new ActiveDirectory(config);
    ad.isUserMemberOf(email, groupName, function(err, isMember) {
        if (err) {
            //console.log('ERROR: ' +JSON.stringify(err));
            return false;
        }
    });
    return true;
}

/**
 * Get User Common Name given an email adress
 * @param {*} email 
 */
function getUserCommonName(email){
    var _ = require('underscore');
    var query = 'userPrincipalName='+email;
    var opts = {
    includeMembership : ['user' ], 
    includeDeleted : false
    };
    var ad = new ActiveDirectory(config);
    ad.find(query, function(err, results) {
        if ((err) || (! results)) {
            //console.log('ERROR: ' + JSON.stringify(err));
            return "";
        }
        var userCommonName = "";
        _.each(results.users, function(user) {
            userCommonName = user.cn;
        });
    });
    //console.log(userCommonName)    
    return user.cn;
}

module.exports.authenticateUser = authenticateUser
module.exports.getUserCommonName = getUserCommonName