const Pool = require("pg").Pool;
const config = require("../config");
const jwt = require('jsonwebtoken');
const itemModel = require('./item');

const pool = new Pool(config.configdB);


//Gets a single Item detail
exports.getItemDetailById = async (id) => {
    try {
        let item = {
            id: 0,
            name: "",
            price: 0.00,
            isavailable: false,
            category: "",
            sub_category: "",
            isworking: true,
            unit_manager_person_id: 0,
            department_id: 0,
            details: []
        }

        if (!id) {
            return false;
        }

        //Get Item
        const client = await pool.connect();
        let itemB = await client.query("SELECT * FROM Item WHERE id=$1", [id]);
        if (itemB.rowCount < 1) {
            return {};
        }

        item.id = itemB.rows[0].id;
        item.name = itemB.rows[0].name;
        item.price = itemB.rows[0].price;
        item.isavailable = itemB.rows[0].isavailable;
        item.category = itemB.rows[0].category;
        item.sub_category = itemB.rows[0].sub_category;
        item.isworking = itemB.rows[0].isworking;
        item.unit_manager_person_id = itemB.rows[0].unit_manager_person_id;
        item.department_id = itemB.rows[0].department_id;

        //Get Details from Item
        let itemDetails = await client.query("SELECT * FROM Item_details WHERE item_id=$1", [id]);
        let i = 0;
        for (i; i < itemDetails.rowCount; i++) {
            item.details[i] = {};
            item.details[i].key = itemDetails.rows[i].chave;
            item.details[i].value = itemDetails.rows[i].valor;
        }


        client.release();
        return item;

    } catch (err) {
        throw new Error(err);
    }
}



//Adds Item to Database
exports.insertNewItem = async (item, user) => {

    try {
        const client = await pool.connect();

        //Se o preço for null
        if (item.price === null || item.price === undefined) {
            item.price = 0.00;
        }
        //Se nome for null
        if (item.name === null || item.name === undefined) {
            let marca = "";
            let modelo = "";
            for (p = 0; p < item.itemDetails.length; p++) {
                if (item.itemDetails[p].key === "Marca") {
                    marca = item.itemDetails[p].value;
                }
                if (item.itemDetails[p].key === "Modelo") {
                    modelo = item.itemDetails[p].value;
                }
            }
            item.name = item.sub_category + " " + marca + " " + modelo;
        }

        //Inserts Item
        console.log("DEEEEEEP");
        console.log(user.department_id);
        let itemQuery = await client.query("INSERT INTO Item(name, price, isavailable, category, sub_category, isworking, unit_manager_person_id, department_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [item.name, item.price, true, item.category, item.sub_category, true, user.id, user.department_id]);
        let queryForItemId = await client.query("SELECT * FROM Item ORDER BY id DESC LIMIT 1");

        //Insert its details
        for (i = 0; i < item.itemDetails.length; i++) {
            itemQuery = await client.query("INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES($1, $2, $3, $4, $5)", [item.itemDetails[i].key, item.itemDetails[i].value, new Date().toISOString().slice(0, 19).replace('T', ' '), user.id, queryForItemId.rows[0].id]);
        }

        client.release();
        return true;

    } catch (error) {
        throw new Error(error);
    }

}
/**
 * Get available and unavailable items from database and process it 
 * FORMAT
 * {
  "Disponíveis": {
    "idAtivo1": {
      "Ativo": "Dell 15",
      "Categoria": "Computadores"
    },
    "idAtivo2": {
      "Ativo": "Secretária Staples",
      "Categoria": "Mobiliário de Escritório"
    }
  },
  "Indisponíveis": {
    "idAtivo3": {
      "Ativo": "Dell 15",
      "Categoria": "Computadores"
    },
    "idAtivo4": {
      "Ativo": "Secretária Staples",
      "Categoria": "Mobiliário de Escritório"
    }
  }
}
 */
exports.getAvailableAndUnavailableItems = async (user) => {
    try {
        var myJson = { "Disponíveis": {}, "Indisponíveis": {}, "Avariados": {} };
        let client = await pool.connect();
        let itemQuerry = await client.query(`SELECT id,name,category,sub_category FROM item WHERE isavailable = 'true' AND isworking = 'true' AND isdeprecated = 'false' AND department_id = $1;`, [user.department_id]);
        for (i = 0; i < itemQuerry.rowCount; i++) {
            myJson.Disponíveis[itemQuerry.rows[i].id] = { "Ativo": itemQuerry.rows[i].name, "Categoria": itemQuerry.rows[i].category, "Sub-categoria": itemQuerry.rows[i].sub_category };
        }
        let itemQuerry1 = await client.query(`SELECT item.id as id,item.name as name,item.category as category,item.sub_category as sub_category ,person.displayname as personname FROM item,person_item,person WHERE person.id=person_item.person_id AND person_item.item_id=item.id AND isavailable = 'false' AND isworking = 'true' AND isdeprecated = 'false' AND item.department_id = $1;`, [user.department_id]);
        for (i = 0; i < itemQuerry1.rowCount; i++) {
            myJson.Indisponíveis[itemQuerry1.rows[i].id] = { "Ativo": itemQuerry1.rows[i].name, "Categoria": itemQuerry1.rows[i].category, "Sub-categoria": itemQuerry1.rows[i].sub_category, "Utilizador Designado": itemQuerry1.rows[i].personname };
        }
        console.log(itemQuerry1)
        var itemQuerry2 = await client.query(`SELECT id,name,category,sub_category FROM item WHERE isworking = 'false' AND isdeprecated = 'false' AND department_id = $1;`, [user.department_id]);
        for (i = 0; i < itemQuerry2.rowCount; i++) {
            myJson.Avariados[itemQuerry2.rows[i].id] = { "Ativo": itemQuerry2.rows[i].name, "Categoria": itemQuerry2.rows[i].category, "Sub-categoria": itemQuerry2.rows[i].sub_category };
        }

        //console.log("uslelllllllllers2345678");
        client.release();
        return myJson;
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * get all items that are loaned to the user.
 * @param {user} user 
 * @returns {JSON} json with all loans 
 * format {{itemid : {"ativo":name,"Requisição":date}},{itemid2 : {"ativo":name2,"Requisição":date2}}}
 */
exports.getLoans = async (user) => {
    try {
        var myJson = {};
        let client = await pool.connect();
        let itemQuerry = await client.query(`SELECT item.id as id, item.name as name, accept.response_action_dateofaction as date FROM item,item_accept,accept WHERE
        item.id = item_accept.item_id and item_accept.accept_response_action_id = accept.response_action_id and accept.response_person_id = $1`, [user.id]);
        console.log(itemQuerry);
        for (i = 0; i < itemQuerry.rowCount; i++) {
            myJson[itemQuerry.rows[i].id] = { "Ativo": itemQuerry.rows[i].name, "Requisição": itemQuerry.rows[i].date }
        }
        client.release();
        return myJson;
    } catch (error) {
        throw new Error(err);
    }
}
/**
 * get all requests related to the user aswell as the state they are in
 * @param {*} user 
 * @returns {JSON}
 */
exports.getRequests = async (user) => {
    try {
        var myJson = {};
        var client = await pool.connect();
        var requestQuerry = await client.query("SELECT action_id,description,action_dateofaction FROM request WHERE person_id = $1", [user.id]);
        var acceptQuerry = await client.query("SELECT response_request_action_id,response_action_dateofaction FROM accept WHERE response_person_id = $1", [user.id])
        var refuseQuerry = await client.query("SELECT response_request_action_id,response_action_dateofaction FROM refuse WHERE response_person_id = $1", [user.id])
        for (i = 0; i < requestQuerry.rowCount; i++) {
            var found = false;
            console.log(myJson);
            console.log(requestQuerry.rows[i].action_id);

            myJson[requestQuerry.rows[i].action_id] = { "Estado": "Pendente", "Requisição": (requestQuerry.rows[i].action_dateofaction).toISOString().substr(0, 10), "Descrição": requestQuerry.rows[i].description };
            for (j = 0; j < acceptQuerry.rowCount; j++) {
                if (acceptQuerry.rows[j].response_request_action_id == requestQuerry.rows[i].action_id) {
                    myJson[requestQuerry.rows[i].action_id].Estado = "Aceite";
                    found = true;
                    break;
                }
            }
            if (found == false) {
                for (j = 0; j < refuseQuerry.rowCount; j++) {
                    if (refuseQuerry.rows[j].response_request_action_id == requestQuerry.rows[i].action_id) {
                        myJson[requestQuerry.rows[i].action_id].Estado = "Recusado";
                        break;
                    }
                }
            }
        }
        client.release();
        return myJson
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * deprecates an item
 * @param {user} user user from jwt
 * @param {Number} itemId itemid 
 * @returns "Success" if it updates
 * "NoJob" if it doesn't do any change
 */
exports.deprecateItem = async (user, itemId) => {
    try {
        var result;
        var client = await pool.connect();
        var itemstatus = await client.query("SELECT isavailable,isdeprecated FROM item WHERE id = $1 AND department_id = $2", [itemId, user.department_id]);
        if (itemstatus.rowCount > 0) {
            if (itemstatus.rows[0].isavailable == true && itemstatus.rows[0].isdeprecated == false) {
                update = await client.query("UPDATE item SET isdeprecated = $1 WHERE id = $2", ['true', itemId]);
                if (update.rowCount > 0) {
                    result = "Success";
                }
                else {
                    result = "Fail";
                }
            }
            else {
                result = "Fail";
            }
        }
        else {
            result = "Fail";
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
    finally {
        client.release();
        return result
    }
}
/**
 * 
 * @param {item} item 
 * @returns json with all "Pedidos" "Avarias" and "Devoluções"
 * FORMAT:
 * {
  "Pedidos": {
    "idPedido1": {
      "Utilizador": "David Paiva",
      "Data": "11/12/2021"
    },
    "idPedido2": {
      "Utilizador": "David Paiva",
      "Data": "11/12/2021"
    }
  },
  "Avarias": {
    "idAvaria1": {
      "Data": "14/12/2021"
    },
    "idAvaria2": {
      "Data": "15/12/2021"
    }
  },
  "Devoluções": {
    "idDev1": {
      "Utilizador": "David Paiva",
      "Data": "11/12/2021"
    },
    "idDev2": {
      "Utilizador": "David Paiva",
      "Data": "11/12/2021"
    }
  }
}
 */
exports.activeHistory = async (item) => {
    try {
        console.log(item);
        var result = { "Pedidos": {}, "Avarias": {}, "Devoluções": {} };
        var client = await pool.connect();
        var activeAccept = await client.query(`SELECT accept.response_action_id as id,accept.response_action_dateofaction as date,person.displayname as name FROM accept,item_accept,person WHERE person.id = accept.response_person_id AND accept.response_action_id = item_accept.accept_response_action_id AND item_accept.item_id=$1`, [item.id]);
        var activeReturn = await client.query(`SELECT return.action_id as id,return.action_dateofaction as date,person.displayname as name FROM return,person
        WHERE person.id=return.person_id AND return.item_id = $1 AND return.isreturned = $2`, [item.id, 'true']);
        var activeIntervention = await client.query(`SELECT intervention.action_id as id,intervention.action_dateofaction as date FROM intervention
        WHERE intervention.item_id = $1`, [item.id]);
        for (i = 0; i < activeAccept.rowCount; i++) {
            result.Pedidos[activeAccept.rows[i].id] = { "Utilizador": activeAccept.rows[i].name, "Data": (activeAccept.rows[i].date).toISOString().substr(0, 10) }
        }
        for (i = 0; i < activeIntervention.rowCount; i++) {
            result.Avarias[activeIntervention.rows[i].id] = { "Data": (activeIntervention.rows[i].date).toISOString().substr(0, 10) }
        }
        for (i = 0; i < activeReturn.rowCount; i++) {
            result.Devoluções[activeReturn.rows[i].id] = { "Utilizador": activeReturn.rows[i].name, "Data": (activeReturn.rows[i].date).toISOString().substr(0, 10) }
        }
    }
    catch (error) {
        throw new Error(error);
    }
    finally {
        client.release();
        return result;
    }
}


exports.getCategories = async () => {
    try {
        //Get Categories
        const client = await pool.connect();

        let cats = await client.query("SELECT DISTINCT category FROM label_details");

        let json = [];
        (cats.rows).forEach(cat => {
            //console.log(cat.category);
            json.push(cat.category);
        });

        client.release();
        return json;

    } catch (err) {
        throw new Error(err);
    }
}

exports.getSubCategories = async (category) => {
    try {
        //Get Sub-Category from Category
        //console.log(category);
        const client = await pool.connect();

        let sub_cats = await client.query(`SELECT DISTINCT sub_category FROM label_details WHERE category = '${category}';`);
        //console.log(sub_cats);
        let json = [];

        (sub_cats.rows).forEach(sub => {
            //console.log(cat.category);
            json.push(sub.sub_category);
        });

        client.release();
        return json;

    } catch (err) {
        throw new Error(err);
    }
}

exports.getBrands = async (category, sub_category) => {
    try {
        //Get Sub-Category from Category
        //console.log(category);
        const client = await pool.connect();
        let query = `SELECT DISTINCT valor FROM item_details WHERE chave = 'Marca' AND item_id IN (SELECT id FROM Item WHERE category = '${category}' AND sub_category = '${sub_category}');`
        let brands = await client.query(query);
        console.log(query);

        let json = [];

        (brands.rows).forEach(b => {
            json.push(b.valor)
        });

        client.release();
        return json;

    } catch (err) {
        throw new Error(err);
    }
}

exports.getActivesReturns = async () => {
    try {
        const client = await pool.connect();
        let query = 'SELECT displayname as "Utilizador",  item.name as "Ativo", item.id as "Ativo_id", category as "Categoria", department.name as "Unidade", action_dateofaction as "Data", isreturned as "Estado"  FROM return, item, person, department WHERE person.id = return.person_id AND item.id = return.item_id AND person.department_id = department.id'
        let info = await client.query(query);
        let json = [];

        (info.rows).forEach(row => {
            row.Lixo = ''
            json.push(row)
        });

        client.release();
        return json;

    } catch (err) {
        throw new Error(err);
    }
}


exports.returnActive = async (unitManagerId, itemID) => {

    try {

        const client = await pool.connect();
        // Remove person_item row 
        await client.query("DELETE FROM person_item WHERE item_id=$1", [itemID]);

        // Update item table
        await client.query("UPDATE item SET isavailable=TRUE WHERE id=$1", [itemID]);

        //Get action_id from return table
        let returnT = await client.query("SELECT action_id from return where item_id=$1 AND isreturned=FALSE", [itemID]);

        // Update return table
        await client.query("UPDATE return SET isreturned=TRUE WHERE item_id=$1 AND action_id=$2", [itemID, returnT.rows[0].action_id]);
        //Insert the information into the unit_manager_return table
        await client.query("INSERT INTO unit_manager_return (unit_manager_person_id, return_action_id) VALUES($1, $2)", [unitManagerId, returnT.rows[0].action_id])

        client.release();
    } catch (error) {
        throw new Error(error);
    }
}

exports.insertItemReturnRequest = async (itemId, user) => {

    try {

        var client = await pool.connect();

        //ACHO QUE FALTA ISTO -> PROBS FALTAM COISAS -> ver melhor
        let acceptResponseActionId = await client.query("SELECT item_accept.accept_response_action_id,accept.response_action_dateofaction as date from item_accept,accept where item_accept.accept_response_action_id = accept.response_action_id AND item_id=$1 ORDER BY item_accept.accept_response_action_id DESC", [itemId]);
        //console.log(acceptResponseActionId);
        await client.query("INSERT INTO return(isreturned, item_id, person_id, accept_response_action_id, action_dateofaction) VALUES($1, $2, $3, $4, $5)", [false, itemId, user.id, acceptResponseActionId.rows[0].accept_response_action_id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
        return true;

    } catch (error) {
        throw new Error(error);
    }
}

exports.getItemOwner = async (itemId) => {

    try {
        var client = await pool.connect();
        var itemQuery = await client.query("SELECT * FROM person_item WHERE item_id=$1", [itemId]);
        if (itemQuery.rowCount < 1) {
            return false;
        }

        return itemQuery.rows[0].person_id;

    } catch (error) {
        throw new Error(error);
    }
}


exports.isTherePendingItemReturnRequestByUserForItem = async (user, itemId) => {

    try {

        var client = await pool.connect();
        var requestQuery = await client.query("SELECT * FROM return WHERE item_id=$1 AND person_id=$2 ORDER BY action_id DESC", [itemId, user.id]);

        //If no request
        if (requestQuery.rowCount < 1) {
            return false;
        }

        //If last request isreturned is false, means there is a pending request for this item by the user
        if (requestQuery.rows[0].isreturned === false) {
            return true;
        }
        else {
            return false;
        }

    } catch (error) {
        throw new Error(error);
    }
}
/**
 * 
 * @param {user} user user details
 * @param {Number} itemId item id number
 * @returns {"Result":"Error"} if fails
 * @returns {"Result":"Success"} if it works
 */
exports.itemBreakdown = async (user, itemId) => {
    try {
        var result
        var client = await pool.connect();
        var itemBreakdown = await client.query(`INSERT INTO intervention (state,item_id,unit_manager_person_id,action_dateofaction) VALUES ($1,$2,$3,$4)`, ["Broken", itemId, user.id, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
        var itemBreakdown2 = await client.query(`UPDATE item SET isworking = FALSE WHERE id = $1 `, [itemId]);
        result = "Success";
    }
    catch (error) {
        result = "Error";
        console.log(error);
        throw new Error(error);
    }
    finally {
        client.release();
        return result;
    }
}

/**
 * 
 * @param {user} user user details
 * @param {Number} itemId item id number
 * @returns {"Result":"Error"} if fails
 * @returns {"Result":"Success"} if it works
 */
exports.itemFix = async (itemId) => {
    try {
        var result;
        var client = await pool.connect();
        var itemFix = await client.query(`UPDATE item SET isworking = TRUE WHERE id = $1 `, [itemId]);
        var update = await client.query(`UPDATE intervention SET state = $1 FROM (SELECT * FROM intervention WHERE item_id = $2 ORDER BY action_dateofaction DESC) as t1 WHERE intervention.action_id = t1.action_id `, ['Solved', itemId])
        result = "Success";

    }
    catch (error) {
        result = "Error";
        console.log(error);
        throw new Error(error);
    }
    finally {
        client.release();
        return result;
    }
}

exports.getLabelDetails = async (category, sub_category) => {
    try {
        //Get Categories
        const client = await pool.connect();
        console.log(category)
        console.log(sub_category)
        let labels_details = await client.query("SELECT label, details FROM label_details WHERE category = $1 AND sub_category = $2", [category, sub_category]);
        console.log("--------", labels_details.rows)
        client.release();
        return labels_details.rows;

    } catch (err) {
        throw new Error(err);
    }
}
