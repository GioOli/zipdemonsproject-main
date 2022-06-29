const Pool = require("pg").Pool;
const config = require("../config");
const jwt = require('jsonwebtoken');
const loginModel = require('./login');

const pool = new Pool(config.configdB);


/**
 * Gets User by their Email
 * @param {*} email 
 * @returns Boolean: false - if User does not exist
 * @returns Json with User Details
 * FORMAT with example data {
    "id": "84",
    "email": "rosarinho@deamons.ipn.pt",
    "displayname": "Rosarinho",
    "department_id": "34",
    "roles": ["normal", ".."],
    "unidade": "Departamento Teste 1",
    "isGestor": false
    }
 */
exports.getUserByEmail = async (email) => {

    try {

        let answer = await this.userExistsByEmail(email);
        if (answer === false) {
            return false;
        }
        //Get user Data
        const client = await pool.connect();
        let user = await client.query("SELECT * FROM Person WHERE email=$1", [email]);

        //Get User role and set it
        let roles = await this.getUserRoleById(user.rows[0].id);
        if (roles === false) {
            console.log("Error, Could not get ROLES of User: " + user.rows[0].id);
            client.release();
            return false;
        }
        user.rows[0].roles = roles;

        //Get User's department name
        let depName = await client.query("SELECT * FROM Department WHERE id=$1", [user.rows[0].department_id]);
        user.rows[0].unidade = depName.rows[0].name;
        //set isGestor
        user.rows[0].isGestor = false;
        user.rows[0].isAdmin = false;
        if (roles !== false && roles.indexOf("unit_manager") !== -1) {
            user.rows[0].isGestor = true;
        }
        if(roles !== false && roles.indexOf("administrator") !== -1){
            user.rows[0].isAdmin = true;
        }

        client.release();
        return user.rows[0];

    } catch (error) {
        throw new Error(error);
    }
};




/**
 * Get the Role of an User from an Id
 * @param {*} userid 
 * @returns Boolean: false - if User does not exist
 * @returns String: Either "normal", "unit_manager" or "administrator".
 */
exports.getUserRoleById = async (userid) => {

    try {

        //Checks if User exists
        let answer = await this.userExistsById(userid);
        if (answer === false) {
            return false;
        }

        let roles = [];
        const client = await pool.connect();
        //Check for role -> User
        role = await client.query("SELECT * FROM Normal WHERE person_id=$1", [userid]);
        if (role.rowCount != 0) {
            roles.push("normal");
            role = await client.query("SELECT * FROM administrator WHERE person_id=$1", [userid]);
            if (role.rowCount != 0) {
                roles.push("administrator");
            }
        } else {
            //Check for role -> unit_manager
            role = await client.query("SELECT * FROM unit_manager WHERE person_id=$1", [userid]);
            if (role.rowCount != 0) {
                roles.push("unit_manager");
            }

            //Check for role -> administrator
            role = await client.query("SELECT * FROM administrator WHERE person_id=$1", [userid]);
            if (role.rowCount != 0) {
                roles.push("administrator");
            }
        }

        client.release();
        return roles;


    } catch (error) {
        throw new Error(error);
    }

}



/**
 * Gets User by their Id
 * @param {*} id 
 * @returns Boolean: false - if User does not exist
 * @returns Json with User Details
 * FORMAT with example data {
    "id": "84",
    "email": "rosarinho@deamons.ipn.pt",
    "displayname": "Rosarinho",
    "department_id": "34",
    "roles": ["normal", ".."],
    "unidade": "Departamento Teste 1",
    "isGestor": false
    }
 */
exports.getUserById = async (id) => {

    try {

        let answer = await this.userExistsById(id);
        if (answer === false) {
            return false;
        }
        const client = await pool.connect();
        let user = await client.query("SELECT * FROM Person WHERE id=$1", [id]);

        //Get User role and set it
        let roles = await this.getUserRoleById(user.rows[0].id);
        if (roles === false) {
            console.log("Error, Could not get ROLES of User: " + id);
            client.release();
            return false;
        }
        user.rows[0].roles = roles;

        //Get User's department name
        let depName = await client.query("SELECT * FROM Department WHERE id=$1", [user.rows[0].department_id]);
        user.rows[0].unidade = depName.rows[0].name;
        //set isGestor
        user.rows[0].isGestor = false;
        user.rows[0].isAdmin = false;
        if (roles !== false && roles.indexOf("unit_manager") !== -1) {
            user.rows[0].isGestor = true;
        }
        if(roles !== false && roles.indexOf("administrator") !== -1){
            user.rows[0].isAdmin = true;
        }

        client.release();
        return user.rows[0];

    } catch (error) {
        throw new Error(error);
    }
};



/**
 * Inserts an User request
 * @param {*} request The String containing the request text of an User
 * @param {*} email Email of the User requesting
 * @returns Boolean: false - If User does not exist
 * @returns Boolean: true - If request insert was successfully completed
 */
exports.insertUserRequest = async (request, email) => {

    try {

        const client = await pool.connect();
        let answer = await this.userExistsByEmail(email);
        if (answer === false) {
            client.release();
            console.log("User is not in the database");
            return false;
        }
        let userIdQuery = await client.query("SELECT * FROM person WHERE email=$1", [email]);

        let user = await client.query("INSERT INTO request(description, person_id, department_id, action_dateofaction) VALUES ($1, $2, $3, $4)", [request, userIdQuery.rows[0].id, userIdQuery.rows[0].department_id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
        client.release();
        return true;

    } catch (error) {
        throw new Error(error);
    }
};




/**
 * Verifies if an User with an Id exists in the database
 * @param {*} id 
 * @returns Boolean: false - If user does not exist
 * @returns Boolean: true - If user exists
 */
exports.userExistsById = async (id) => {

    try {

        const client = await pool.connect();
        let answer = await client.query("SELECT * FROM person WHERE id=$1", [id]);
        client.release();
        if (answer.rowCount < 1) {
            return false;
        }
        else {
            return true;
        }

    } catch (error) {
        throw new Error(error);
    }
};



/**
 * Verifies if an User with an Email exists in the database
 * @param {*} email 
 * @returns Boolean: false - If user does not exist
 * @returns Boolean: true - If user exists
 */
exports.userExistsByEmail = async (email) => {

    try {

        const client = await pool.connect();
        let answer = await client.query("SELECT * FROM Person WHERE email=$1", [email]);
        client.release();
        if (answer.rowCount < 1) {
            return false;
        }
        else {
            return true;
        }

    } catch (error) {
        throw new Error(error);
    }
};



//Verifica O utilizador com o id especificado e se os dados estão
//atualizados. Caso não estejam, atualiza. Devolve:
//  true:   Updated
//  false:  Não existe
exports.verifyAndUpdateUserData = async (user) => {

    try {

        const client = await pool.connect();
        let answer = await client.query("SELECT * FROM Person WHERE id=$1", [user.id]);
        if (answer.rowCount < 1) {
            client.release();
            return false;
        }
        else {
            //NAO PERCEBO ISTO - RICARDO & LEAL //Ignora...old features..
            answer = await client.query("UPDATE Person SET email=$1, displayname=$2 WHERE id=$3", [user.email, user.displayname, user.id]);
            client.release();
            return true;
        }

    } catch (error) {
        throw new Error(error);
    }
};



//Verifica se utilizador com ID já existe e caso não exista, cria. Devolve:
//  "success":          caso utilizador não exista, e tenha sido inserido
//  "already exists":   caso utilizador com ID exista. Não houve inserção
//REQUIRES:
//Object with attributes: email, username. (department_id defaults to 0)
/**
 * Inserts an User into the database in case the email is not in use. It inserts the user as Normal and into the first department in database.
 * @param {*} user {
 *      "email": User's email,
 *      "displayname": User's name
 * }
 * @returns String: "already exists" - User exists. No User has been created.
 * @returns String: "success" - User was successfully created in the database.
 */
exports.insertUser = async (user) => {

    try {

        let exists = await this.getUserByEmail(user.email);
        if (exists) {
            return "already exists";
        }
        else {
            const client = await pool.connect();
            let firstDepartment = await client.query("SELECT * FROM Department ORDER BY id DESC");
            let answer = await client.query("INSERT INTO Person(email, displayname, department_id) VALUES ($1, $2, $3)", [user.email, user.displayname, firstDepartment.rows[0].id]);

            let freshlyAddedUser = await client.query("SELECT * FROM Person WHERE email=$1", [user.email]);
            answer = await client.query("INSERT INTO Normal(person_id) VALUES ($1)", [freshlyAddedUser.rows[0].id]);
            client.release();
            return "success";
        }

    } catch (error) {
        throw new Error(error);
    }
};



//Busca todos os iteams requesitados e em posse do utilizador. Devolve:
//  Object[]:   Sucesso 
//Input: exists: person
//       quantified: true para devolver array com quantidade de cada item com valor identico,
//       false para devolver um array com cada item individualmente
/**
 * Retrieves all Items currently under an User's possession.
 * @param {*} exists The User {
 *      "id": User's id
 * }
 * @param {*} quantified Boolean: true to return User's items summed together into quantities. false to return User's items separately one by one.
 * @returns Array[] of Items (example): [{
        "id": "78",
        "name": "Mesa Quadrada",
        "price": 999.99,
        "isavailable": false,
        "category": "",
        "sub_category": "Quadrada",
        "unit_manager_person_id": "83",
        "department_id": "35",
        "details": [
            {
                "key": "Tamanho",
                "value": "1m-2m"
            },
            {
                "key": "Altura",
                "value": "80cm"
            }
        ],
        "count": 1,
        "request_date": "2021-11-29T00:00:00.000Z"
    }]
 */
exports.getUserItems = async (exists, quantified) => {

    try {

        if (!exists) {
            return false;
        }
        else {
            const client = await pool.connect();
            let userItemids = [];

            //Get all user Items ids and add hem to an array
            let userRequestsQuery = await client.query("SELECT * FROM person_item WHERE person_id=$1;", [exists.id]);
            for (i = 0; i < userRequestsQuery.rowCount; i++) {
                userItemids.push(userRequestsQuery.rows[i].item_id);
            }

            let allItems = [];

            //For each item, retrieve Item Data and look for its date
            i = 0;
            while (i < userItemids.length) {
                let answer = await client.query("SELECT * from Item WHERE id=$1", [userItemids[i]]);
                console.log(answer.rows[0]);
                let thisItem = {
                    id: 0,
                    name: "",
                    price: 0.0,
                    isavailable: true,
                    category: "",
                    sub_category: "",
                    unit_manager_person_id: 0,
                    department_id: 0,
                    details: [],
                    count: 1,
                    request_date: ""
                }

                thisItem.id = answer.rows[0].id;
                thisItem.name = answer.rows[0].name;
                thisItem.price = answer.rows[0].price;
                thisItem.isavailable = answer.rows[0].isavailable;
                thisItem.category = answer.rows[0].category;
                thisItem.sub_category = answer.rows[0].sub_category;
                thisItem.unit_manager_person_id = answer.rows[0].unit_manager_person_id;
                thisItem.department_id = answer.rows[0].department_id;
                thisItem.details = [],
                    thisItem.count = 1


                //Get All Accepts request from user and order them by lastest first
                let acceptedRequests = await client.query("SELECT * FROM accept WHERE response_person_id=$1 ORDER BY response_action_id DESC", [exists.id]);

                //For each accepted request, check if any of the items match a currently user item, if so, add the date to item
                for (p = 0; p < acceptedRequests.rowCount; p++) {
                    let acceptedRequestItems = await client.query("SELECT * FROM item_accept WHERE accept_response_action_id=$1", [acceptedRequests.rows[p].response_action_id]);

                    //Iterate Items and check if it is present
                    for (pp = 0; pp < acceptedRequestItems.rowCount; pp++) {
                        if (acceptedRequestItems.rows[pp].item_id === userItemids[i]) {
                            thisItem.request_date = (acceptedRequests.rows[p].response_action_dateofaction).toISOString().substr(0, 10);
                        }
                    }
                }

                //Get all item details for each item so to compare later
                let itemDetailsQuery = await client.query("SELECT * FROM Item_details WHERE item_id=$1", [userItemids[i]]);
                ii = 0;
                while (ii < itemDetailsQuery.rowCount) {
                    thisItem.details[ii] = {};
                    thisItem.details[ii].key = itemDetailsQuery.rows[ii].chave;
                    thisItem.details[ii].value = itemDetailsQuery.rows[ii].valor;

                    ii = ii + 1;
                }
                allItems.push(thisItem);

                i = i + 1;
            }
            client.release();
            console.log("\nTodos os items:\n");
            for (p = 0; p < allItems.length; p++) {
                console.log("\nItem:");
                console.log("Id: " + allItems[p].id);
                console.log("nome: " + allItems[p].name + "\n");
            }


            //Se quantified = falso, então devolver todos os items, individualmente
            if (!quantified) {
                return allItems;
            }

            //Se quantified = true, então devolver todos os itemms com caracteristicas iguais
            //acompladas
            if (quantified) {
                console.log("HEEEREASAS");
                return quantifyItems(allItems);
            }

        }

    } catch (error) {
        throw new Error(error);
    }
};

exports.getPendingRequests = async (exists, quantified) => {
    try {
        let item = {
            id: 0,
            name: "",
            description: "",
            price: 0.0,
            isavailable: true,
            managerId: 0,
            departmentId: 0,
            details: [],
            count: 1
        }
        let status = 'false';
        const client = await pool.connect();
        let allItemIds = await client.query("SELECT item_id FROM history WHERE person_id = $1 AND status=$2 AND type = $3", [exists.id, status, 'itemRequest']);
        let allItems = [];
        i = 0;
        while (i < allItemIds.rowCount) {
            let answer = await client.query("SELECT * from Item WHERE id=$1", [allItemIds.rows[i].item_id]);
            console.log(answer.rows[0]);
            let thisItem = {
                id: 0,
                name: "",
                description: "",
                price: 0.0,
                isavailable: true,
                managerId: 0,
                departmentId: 0,
                details: [],
                count: 1
            }

            thisItem.id = answer.rows[0].id;
            thisItem.name = answer.rows[0].name;
            thisItem.description = answer.rows[0].description;
            thisItem.price = answer.rows[0].price;
            thisItem.isavailable = answer.rows[0].isavailable;
            thisItem.managerId = answer.rows[0].unit_manager_person_id;
            thisItem.departmentId = answer.rows[0].name;
            thisItem.details = [],
                thisItem.count = 1

            console.log(answer.rows[0].id);

            //Get all item details for each item so to compare later
            let itemDetailsQuery = await client.query("SELECT * FROM Item_details WHERE item_id=$1", [thisItem.id]);
            ii = 0;
            while (ii < itemDetailsQuery.rowCount) {
                thisItem.details[ii] = {};
                thisItem.details[ii].key = itemDetailsQuery.rows[ii].chave;
                thisItem.details[ii].value = itemDetailsQuery.rows[ii].valor;

                ii = ii + 1;
            }
            allItems[i] = thisItem;

            i = i + 1;
        }
        client.release();
        console.log("\nTodos os items:\n");
        for (p = 0; p < allItems.length; p++) {
            console.log("\nItem:");
            console.log("Id: " + allItems[p].id);
            console.log("nome: " + allItems[p].name + "\n");
        }


        //Se quantified = falso, então devolver todos os items, individualmente
        if (!quantified) {
            return allItems;
        }

        //Se quantified = true, então devolver todos os itemms com caracteristicas iguais
        //acompladas
        if (quantified) {
            return quantifyItems(allItems);
        }

    } catch (error) {
        throw new Error(error);
    }
    //Já correu por todos os items, agora devolve a lista

}

//Funções
/**
 * Receives an array of Items and returns the items summed together into quantities of similar items instead of single separate items
 * @param {*} allItems Array[] of Items
 * @returns Array[] of Items
 */
function quantifyItems(allItems) {
    let quantifiedItems = [];
    let i = 0;
    console.log("\n-START- Iteração sobre todos os Items\n");
    //Itera sobre todos os items
    while (i < allItems.length) {
        //verifica se o item está null (Já foi adicionado ao quatified Items)
        //console.log("\nVerificando se o Item:\nNome: "+allItems[i].name+"\nId: "+allItems[i].id+"\nEstá null.");
        if (allItems[i] === null) {
            console.log("Está null. CONTINUE para o próximo item base");
            i++;
            continue;
        }

        console.log("Não está.\nAdicionando o Item anterior à lista quantified.");
        console.log("\nQuantifiedItems tem lenght: " + quantifiedItems.length);
        //Adiciona ao quantified Items e set null
        quantifiedItems[quantifiedItems.length] = allItems[i];
        console.log("Adicionado. Verificar:\n" + quantifiedItems[quantifiedItems.length - 1].name);
        console.log("quantified length now: " + quantifiedItems.length);

        //Procura todos os outros items à frente se os valores são todos iguais (caso nao seja o ultimo item na lista)
        if (i < allItems.length - 1) {
            console.log("\nCONDIÇÃO\n(i < allItems.length -1)\ni: " + i + "\nallItems.length: " + allItems.length);
            let ii = i + 1;
            while (ii < allItems.length) {
                //Se o item a ser analizado for null continues
                if (allItems[ii] === null) {
                    ii++
                    continue;
                }
                //Verifica se os valores base (nome, descrição) são iguais
                console.log("\nVerificando se:\n");
                console.log(allItems[i].name + "=" + allItems[ii].name);
                if (allItems[i].name !== allItems[ii].name) {
                    console.log("\nNome e descrição nao sao iguais!\nContinuando!\n");
                    ii++
                    continue;
                }

                //Compara cada e todos os details
                if (allItems[i].details.length != allItems[ii].details.length) {
                    console.log("\nNão tem o mesmo número de detalhes. break e avança!\n");
                    ii++
                    continue;
                }

                console.log("\nComeçando a iteração entre cada detalhe dos Items:\n");
                //Itera a cada detail do item inicial
                let isEqual = true;
                for (rot = 0; rot < allItems[i].details.length; rot++) {
                    //Itera a cada detail do item a ser comparado
                    let rotIsEqual = false;
                    for (rot2 = 0; rot2 < allItems[ii].details.length; rot2++) {
                        //Verifica se as chaves sao iguais. continue caso nao sejam. Caso
                        //venham a ser, ser rotIsEqual para true. Todas as rotisEquals
                        //para todos os details tem de ser iguais para que isEqual seja true
                        console.log("\nVerificando se as chaves dos items fazem match:\nItem1: " + allItems[i].details[rot].key + "\nItem2: " + allItems[ii].details[rot2].key);
                        if (allItems[i].details[rot].key != allItems[ii].details[rot2].key) {
                            console.log("Não fizeram! Verificando a proxima chave do Iteam a ser comparado!");
                            continue;
                        }
                        else {
                            console.log("\nCHAVES FIZERAM MATCH! VERIFICAR VALORES:")
                            console.log("\nItem1: " + allItems[i].details[rot].value + "\nItem2: " + allItems[ii].details[rot2].value + "\n");
                            if (allItems[i].details[rot].value == allItems[ii].details[rot2].value) {
                                console.log("FIZERAM MATCH OS VALORES! ambos são iguais!\nSETTING ROTISEQUAL PARA TRUE E SAINDO DO LOOP!\n");
                                rotIsEqual = true;
                                break;
                            }
                            else {
                                console.log("NAO FIZERAM MATCH! :(. Fazendo break e rotisequal continua false");
                                break;
                            }
                        }
                    }

                    //Se a analise dos details vier negativa, mesmo que num só detalhe,
                    //quebra a rotação e set isEqual para falso.
                    console.log("\nVERIFICANDO SE DAO IGUAIS");
                    if (rotIsEqual) {
                        console.log("SAO TOTALMENTE IGUAIS\n");
                        isEqual = true;
                        break;
                    }

                }

                //Se não for igual o item base e o comparado, continua para o item seguinte
                if (!isEqual) {
                    console.log("NAO SAO IGUAIS :(");
                    ii++
                    continue;
                }

                //Se for igual, incremente o 'count' do item base e define o item comparado
                //como null.
                console.log("SETTING QUANTIFIED");
                quantifiedItems[quantifiedItems.length - 1].count = quantifiedItems[quantifiedItems.length - 1].count + 1;
                allItems[ii] = null;

                //Passa ao proximo item a ser comparado
                ii++;

            }


        }

        console.log("Item será agora set to null");
        allItems[i] = null;

        //Passa ao elemento seguinte
        i++;
        console.log("\ni: \n" + i);
    }
    return quantifiedItems;
};

/**
 * Inserts a new request into the database
 * @param {*} user 
 * @param {*} text 
 */
exports.makeRequest = async (user, text) => {
    try {
        let client = await pool.connect();
        console.log(user);
        console.log(text);
        let itemQuerry = await client.query("INSERT INTO request (description,person_id,action_dateofaction) VALUES ($1,$2,$3)", [text, user.id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getUserHistory = async (user) => {
    try {
        var result = [];
        var client = await pool.connect();
        var historyaccept = await client.query(`SELECT item.id as id,item.name as name, item.category as category, item.sub_category as sub_category, department.name as unidade, accept.response_action_dateofaction as requisicao, accept.response_action_id as action_id
        FROM item, department, item_accept,accept,person WHERE person.id = $1 and accept.response_action_id = item_accept.accept_response_action_id and item.id = item_accept.item_id 
        and item.department_id = department.id and person.id = accept.response_person_id`, [user.id]);
        //console.log(historyaccept);
        for (i = 0; i < historyaccept.rowCount; i++) {
            var currentObj = { "id": historyaccept.rows[i].id, "Ativo": historyaccept.rows[i].name, "Categoria": historyaccept.rows[i].category, "Sub-Categoria": historyaccept.rows[i].sub_category, "Unidade": historyaccept.rows[i].unidade, "Requisição": (historyaccept.rows[i].requisicao).toISOString().substr(0, 10) };
            var historyreturn = await client.query(`SELECT return.action_dateofaction as devolucao FROM return WHERE return.person_id = $1 AND return.accept_response_action_id = $2 AND return.item_id=$3`, [user.id, historyaccept.rows[i].action_id, historyaccept.rows[i].id]);
            if (historyreturn.rowCount > 0) {
                currentObj["Devolução"] = (historyreturn.rows[0].devolucao).toISOString().substr(0, 10);
            }
            else {
                currentObj["Devolução"] = "Por devolver";
            }
            result.push(currentObj);
        }
    }
    catch (error) {
        result = { "Error": "Fail" }
        throw new Error(error);
    }
    finally {
        client.release();
        return result;
    }
}
