const Pool = require("pg").Pool;
const config = require("../config");
const jwt = require('jsonwebtoken');
const itemModel = require('./item');

const pool = new Pool(config.configdB);


//Gets a single Request detail 
exports.getRequestById = async (id) => {

    try {

        const client = await pool.connect();
        let query = await client.query("SELECT * FROM request WHERE action_id=$1", [id]);
        if (query.rowCount < 1) {
            return false;
        }

        let request = {
            description: query.rows[0].description,
            person_id: query.rows[0].person_id,
            action_id: id,
            department_id: query.rows[0].department_id,
            action_dateofaction: query.rows[0].action_dateofaction
        }

        client.release();
        return request;


    } catch (error) {
        throw new Error(error);
    }

}



//Accepts a Request. Requires requestID and User(manager) object
exports.acceptRequestById = async (requestId, user, itemIds) => {

    try {

        const client = await pool.connect();

        //Obter Request
        let request = await client.query("SELECT * FROM request WHERE action_id=$1", [requestId]);

        //Verificar se todos os Items estão disponiveis e associar os disponiveis
        let availableIds = [];
        console.log(itemIds);
        for (i = 0; i < itemIds.length; i++) {
            query = await client.query("SELECT * FROM item WHERE id=$1", [itemIds[i]]);
            if (query.rowCount < 1) {
                console.log("Item with id: $1 -DOES NOT EXIST.\nCannot associate it with a request. Skipping.", [itemIds[i]]);
            }
            else {
                if (query.rows[0].isavailable === false) {
                    console.log("Item with id: $1 -IS NOT AVAILABLE.\nCannot associate it with a request. Skipping.", [itemIds[i]]);
                }
                else {
                    availableIds.push(itemIds[i]);
                }
            }

        }
        let acceptResponse;
        for (i = 0; i < availableIds.length; i++) {
            if (i === 0 && availableIds.length > 0) {
                //Aceitar pedido
                console.log("ACEITANDO PEDIDO");
                await client.query("INSERT INTO accept(response_request_action_id, response_person_id, response_unit_manager_person_id, response_action_dateofaction) VALUES($1, $2, $3, $4)", [requestId, request.rows[0].person_id, user.id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
                acceptResponse = await client.query("SELECT * FROM accept WHERE response_request_action_id=$1 ORDER BY response_action_id DESC LIMIT 1", [requestId]);
            }

            let associate = await client.query("INSERT INTO item_accept(item_id, accept_response_action_id) VALUES($1, $2)", [availableIds[i], acceptResponse.rows[0].response_action_id]);
            associate = await client.query("INSERT INTO person_item(person_id, item_id) VALUES($1, $2)", [request.rows[0].person_id, availableIds[i]]);
            console.log("Item with id: $1 -Associated to user: $2.", [availableIds[i], user.id]);
            console.log(typeof user.id);

            //Set item as unavailable

            await client.query("UPDATE item SET isavailable=$1 WHERE id=$2", [false, availableIds[i]]);
        }

        return true;

    } catch (error) {
        throw new Error(error);
    }

}



//Refuses a Request. Requires requestID and User(manager) object
exports.refuseRequest = async (requestId, user) => {

    try {

        const client = await pool.connect();

        //Obter Request
        let request = await client.query("SELECT * FROM request WHERE action_id=$1", [requestId]);

        //Recusar pedido
        let query = await client.query("INSERT INTO refuse(response_request_action_id, response_person_id, response_unit_manager_person_id, response_action_dateofaction)" +
            "VALUES($1, $2, $3, $4)", [requestId, request.rows[0].person_id, user.id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);

        return true;

    } catch (error) {
        throw new Error(error);
    }

}



//Get request by Department ID
exports.getRequestsByDepartmentId = async (departmentId) => {

    try {

        const client = await pool.connect();

        //Obter Departamento/Unidade
        let unidadeQ = await client.query("SELECT * FROM department WHERE id=$1", [departmentId]);
        let unidade = unidadeQ.rows[0];

        //Obter Requests
        let query = await client.query("SELECT * FROM request WHERE department_id=$1", [departmentId]);
        let requests = [];

        for (i = 0; i < query.rowCount; i++) {

            //Check if request in question has been accepted or requested by now
            var acceptedQuery = await client.query("SELECT * FROM accept WHERE response_request_action_id=$1", [query.rows[i].action_id]);
            var refusedQuery = await client.query("SELECT * FROM refuse WHERE response_request_action_id=$1", [query.rows[i].action_id]);
            if (acceptedQuery.rowCount > 0 || refusedQuery.rowCount > 0) {
                continue;
            }

            let user = await client.query("SELECT * FROM person WHERE id=$1", [query.rows[i].person_id]);
            let tempReq = {
                id: query.rows[i].action_id,
                utilizador: user.rows[0].displayname,
                data: (query.rows[i].action_dateofaction).toISOString().substr(0, 10),
                unidade: unidade.name
            };

            requests.push(tempReq);
        }

        return requests;

    } catch (error) {
        throw new Error(error);
    }

}

