const Pool = require("pg").Pool;
const config = require("../config");

const pool = new Pool(config.configdB);
//exports.pool = pool;

exports.populateTables = async () => {

    try {

        //Departamentos
        const client = await pool.connect();
        let user = await client.query(`INSERT INTO Department(name, description) VALUES ('LIS', 'Laboratory for Informatics and Systems')`);
        user = await client.query(`INSERT INTO Department(name, description) VALUES ('FITOLAB', 'Laboratory for Phytopathology')`);
        user = await client.query(`INSERT INTO Department(name, description) VALUES ('LEC', 'Laboratory for Electroanalysis and Corrosion')`);

        //UserTable
        let department = await client.query(`SELECT * FROM department WHERE name='LIS'`);
        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('davidpaiva@deamons.ipn.pt', 'David', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='davidpaiva@deamons.ipn.pt'`);
        //await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);
        user = await client.query(`INSERT INTO unit_manager VALUES ('TRUE', ${user.rows[0].id})`);

        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('rosarinho@deamons.ipn.pt', 'Rosarinho', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='rosarinho@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);

        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('jleal@deamons.ipn.pt', 'Leal', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='jleal@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);

        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('ricardosilva@deamons.ipn.pt', 'Ricardo', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='ricardosilva@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);

        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('carolina@deamons.ipn.pt', 'Carolina', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='carolina@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);

        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('filipesantos@deamons.ipn.pt', 'Filipe', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='filipesantos@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);

        //ADMIN
        await client.query(`INSERT INTO Person(email, displayname, department_id) VALUES ('deamon@deamons.ipn.pt', 'Admin', ${department.rows[0].id})`);
        user = await client.query(`SELECT * FROM person WHERE email='deamon@deamons.ipn.pt'`);
        await client.query(`INSERT INTO Normal VALUES (${user.rows[0].id})`);
        await client.query(`INSERT INTO administrator VALUES (${user.rows[0].id})`);



        //Alguns Items
        user = await client.query(`SELECT * FROM person WHERE email='davidpaiva@deamons.ipn.pt'`);

        let item = await client.query(`INSERT INTO Item(name, price, isavailable, category, sub_category, isworking, unit_manager_person_id, department_id) VALUES ('Aspirador Rowenta', 9.99, ${true}, 'Eletro-domésticos', 'Aspiradores', ${true}, ${user.rows[0].id}, ${department.rows[0].id})`);
        item = await client.query(`SELECT * FROM item ORDER BY id DESC`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Potência', '2000W', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Rowenta', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`)

        await client.query(`INSERT INTO Item(name, price, isavailable, category, sub_category, isworking, unit_manager_person_id, department_id) VALUES ('Dell XPS', 999.99, ${true}, 'Computador', 'Laptop', ${true}, ${user.rows[0].id}, ${department.rows[0].id})`);
        item = await client.query(`SELECT * FROM item ORDER BY id DESC`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Marca', 'Dell', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Ecrã', '14 Polegadas', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Modelo', 'XPS', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);

        await client.query(`INSERT INTO Item(name, price, isavailable, category, sub_category, isworking, unit_manager_person_id, department_id) VALUES ('Xiaomi Mi Note 10', 999.99, ${true}, 'Comunicações', 'Telemóvel', ${true}, ${user.rows[0].id}, ${department.rows[0].id})`);
        item = await client.query(`SELECT * FROM item ORDER BY id DESC`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Xiaomi', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('RAM', '8GB', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('CPU', 'Snapdragon 745G', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);

        //Departamento 2
        department = await client.query(`SELECT * FROM department WHERE name='LEC'`);
        await client.query(`INSERT INTO Item(name, price, isavailable, category, sub_category, isworking, unit_manager_person_id, department_id) VALUES ('Mesa Quadrada', 300.0, ${true}, 'Mesa', 'Quadrada', ${true}, ${user.rows[0].id}, ${department.rows[0].id})`);
        item = await client.query(`SELECT * FROM item ORDER BY id DESC`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'IKEA', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Tamanho', '1m-2m', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id) VALUES ('Altura', '80cm', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${user.rows[0].id}, ${item.rows[0].id})`);

        //Label Details
        await client.query(`INSERT INTO label_details (category,sub_category,label,details) VALUES ('Computadores','Desktop','Modelo','["L340H","Predador 11","XPS","ZenBook"]')`)
        await client.query(`INSERT INTO label_details (category,sub_category,label,details) VALUES ('Computadores','Desktop','Marca','["Lenovo","Asus","HP","Toshiba"]')`)
        await client.query(`INSERT INTO label_details (category,sub_category,label,details) VALUES ('Computadores','Desktop','Fisicas','{"Cor":["Preto","Branco","Cinzento"],"Peso": ["< 1.5 Kg", "1.5 Kg - 2 Kg", "> 2Kg"],"Altura": ["10 cm - 15 cm", "15 cm - 20 cm"],"Largura": ["10 cm - 15 cm", "15 cm - 20 cm"],"Profundidade": ["10 cm - 15 cm", "15 cm - 20 cm"]}')`)
        await client.query(`INSERT INTO label_details (category, sub_category, label, details) VALUES ('Computadores', 'Desktop', 'Placa Gráfica','{"Gráfica": ["NVIDIA", "GTX"],"GPU": ["2GB", "4GB", "8GB", "16GB"]}')`)
        await client.query(`INSERT INTO label_details (category, sub_category, label, details)VALUES('Computadores', 'Desktop', 'Sistema Operativo','["Windows", "Mac", "Linux"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Eletro-domésticos', 'Aspiradores', 'Chão','["Lisos", "Alcatifas", "Lisos e alcatifas"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Eletro-domésticos', 'Aspiradores', 'Tipo','["Cilíndrico", "Vertical", "Pó e água","Pó portátil (sem fio)"]')`)
        await client.query(`INSERT INTO label_details (category,sub_category,label,details) VALUES ('Eletro-domésticos','Aspiradores','Marca','["Rowenta","HOOVER 11","IROBOT Roomba","X-Plorer Serie 60"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Eletro-domésticos', 'Aspiradores', 'Escovas acessórias','["Sim", "Não"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Eletro-domésticos', 'Aspiradores', 'Capacidade saco de pó', '["< 3L", "3L - 4.5L", "> 4.5L"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Eletro-domésticos', 'Aspiradores', 'Potência', '["< 400 W", "400 W - 550 W", "> 550 W"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Sistema Operativo', '["Android 9", "Android 10", "Android 11","iOS 15.1","iOS 15.2","iOS 15.3"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Cartões', '["SIM1", "SIM2", "SD"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Marca', '["Samsung", "Xiaomi", "Apple"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Taxa de Atualização', '["80Hz", "90Hz", "120Hz"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Resolução Câmara', '["32MP","64MP", "128MP"]')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Fisicas', '{"Cor": ["Preto", "Branco", "Cinzento"],"Peso": ["< 150 g", "150 Kg - 170 g", "> 170 g"],"Altura": ["14 cm - 16 cm", "16 cm - 28 cm"],"Largura": ["7 cm - 9 cm", "9 cm - 11 cm"]}')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Comunicações', 'Telemóvel', 'Memória', '{"RAM": ["2GB", "4GB", "8GB", "16GB"],"Interna": ["32MB", "64MB", "128MB"],"Externa": ["Sim", "Não"]}')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details) VALUES('Comunicações', 'Telemóvel', 'Conexões', '{"Tipo de rede": ["3G", "4G", "5G"],"Bluetooh": ["Sim", "Não"],"GPS": ["Sim", "Não"]}')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Mesa', 'Quadrada', 'Físicas','{"Cor": ["Preto", "Branco", "Cinzento"],"Peso": ["< 15 Kg", "15 Kg - 20 Kg", "> 20Kg"],"Altura": ["60 cm - 90 cm", "90 cm - 150 cm"],"Largura": ["100 cm - 120 cm", "120 cm - 150 cm"],"Profundidade": ["10 cm - 15 cm", "15 cm - 20 cm"]}')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Mesa', 'Quadrada', 'Tipologia','{"Pernas": ["4", "6", "8"],"passagem de Cabos": ["Sim", "Não"],"Ajustável": ["Sim", "Não"]}')`)
        await client.query(`INSERT INTO label_details(category, sub_category, label, details)VALUES('Mesa', 'Quadrada', 'Marca','["LERHAMN","NORDVIKEN","LISABO","MÖRBYLÅNGA"]')`)

        //Brands to item_details
        /*
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'XPTO 4000', '2021-12-11', ${user.rows[0].id}, 1)`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Toshia', '2021-12-11', ${user.rows[0].id}, 2)`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Xiaomi', '2021-12-11', ${user.rows[0].id}, 3)`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Apple', '2021-12-11', ${user.rows[0].id}, 3)`)
        await client.query(`INSERT INTO item_details(chave, valor, data, unit_manager_person_id, item_id)VALUES('Marca', 'Tab IPN', '2021-12-11', ${user.rows[0].id}, 4)`)
        */


        client.release();

    } catch (error) {
        throw new Error(error);
    }
};

//SE MUDAREM OS ITENS QUE ESTÃO A SER INSERIDOS EM CIMA TÊM DE MUDAR AQUI TAMBÉM NA PARTE EM QUE ELE ATRIBUI UM ITEM AO PEDIDO
exports.acceptAndRefuseRequests = async () => {

    try {
        const client = await pool.connect();

        //Inserir pedidos do David
        unit_manager = await client.query(`SELECT * FROM person WHERE email='davidpaiva@deamons.ipn.pt'`);

        //criar novos pedidos
        let pedido = "Preciso de um portátil com 8GB de RAM ou mais";
        let new_request1 = await client.query(`INSERT INTO request(description, person_id, department_id, action_dateofaction) VALUES ('${pedido}',${unit_manager.rows[0].id},${unit_manager.rows[0].department_id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') RETURNING *`);

        pedido = "Preciso de uma mesa de reuniões com capacidade para no mínimo 8 pessoas";
        let new_request2 = await client.query(`INSERT INTO request(description, person_id, department_id, action_dateofaction) VALUES ('${pedido}',${unit_manager.rows[0].id},${unit_manager.rows[0].department_id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') RETURNING *`);

        pedido = "Preciso de um telemóvel";
        let new_request3 = await client.query(`INSERT INTO request(description, person_id, department_id, action_dateofaction) VALUES ('${pedido}',${unit_manager.rows[0].id},${unit_manager.rows[0].department_id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') RETURNING *`);

        //Aceitar pedido 1
        let action = await client.query(`INSERT INTO accept(response_request_action_id, response_person_id, response_unit_manager_person_id, response_action_dateofaction) VALUES (${new_request1.rows[0].action_id},${new_request1.rows[0].person_id},${unit_manager.rows[0].id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') RETURNING *`);
        //Atribuir item ao pedido 1
        let ativo = await client.query(`SELECT * FROM item WHERE category='Computador' AND sub_category='Laptop' `);
        await client.query(`INSERT INTO item_accept (item_id, accept_response_action_id) VALUES (${ativo.rows[0].id},${action.rows[0].response_action_id})`);
        await client.query(`INSERT INTO person_item (person_id, item_id) VALUES (${unit_manager.rows[0].id},${ativo.rows[0].id})`);

        //Devolver pedido 1
        //await client.query(`INSERT INTO return(isreturned,accept_response_action_id,item_id,person_id,action_dateofaction) VALUES(true,${action.rows[0].response_action_id},${ativo.rows[0].id},${unit_manager.rows[0].id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`);
        //await client.query(`DELETE FROM person_item WHERE item_id=$1`, [ativo.rows[0].id]);

        //Meter pedido 1 Avariado
        await client.query(`INSERT INTO intervention(state,item_id,unit_manager_person_id,action_dateofaction) VALUES('Avariado',${ativo.rows[0].id},${unit_manager.rows[0].id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`);

        //Aceitar pedido 2
        action = await client.query(`INSERT INTO accept(response_request_action_id, response_person_id, response_unit_manager_person_id, response_action_dateofaction) VALUES (${new_request2.rows[0].action_id},${new_request2.rows[0].person_id},${unit_manager.rows[0].id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') RETURNING *`);
        //Atribuir item ao pedido 2
        ativo = await client.query(`SELECT * FROM item WHERE category='Mesa' AND sub_category='Quadrada' `);
        await client.query(`INSERT INTO item_accept (item_id, accept_response_action_id) VALUES (${ativo.rows[0].id},${action.rows[0].response_action_id})`);
        await client.query(`INSERT INTO person_item (person_id, item_id) VALUES (${unit_manager.rows[0].id},${ativo.rows[0].id})`);


        //Recusar pedido 3
        await client.query(`INSERT INTO refuse(response_request_action_id, response_person_id, response_unit_manager_person_id, response_action_dateofaction) VALUES (${new_request3.rows[0].action_id},${new_request3.rows[0].person_id},${unit_manager.rows[0].id},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`);

        client.release();

    } catch (error) {
        throw new Error(error);
    }

};



exports.deleteTables = async () => {

    try {

        const client = await pool.connect();
        //let query = await client.query(`DELETE FROM person_item`);
        let query = await client.query(`DELETE FROM Normal`);
        query = await client.query(`DELETE FROM Administrator`);
        query = await client.query(`DELETE FROM person_item`);
        query = await client.query(`DELETE FROM item_details`);
        query = await client.query(`DELETE FROM item_accept`);
        query = await client.query(`DELETE FROM Item`);
        query = await client.query(`DELETE FROM unit_manager_return`);
        query = await client.query(`DELETE FROM intervention`);
        query = await client.query(`DELETE FROM accept`);
        query = await client.query(`DELETE FROM refuse`);
        query = await client.query(`DELETE FROM request`);
        query = await client.query(`DELETE FROM unit_manager`);
        query = await client.query(`DELETE FROM Person`);
        query = await client.query(`DELETE FROM Item`);
        query = await client.query(`DELETE FROM Department`);

        client.release();

    } catch (error) {
        throw new Error(error);
    }

}

/**
 * Get all normal users ordered by department 
 */
exports.getNormalUsersOrderByDepartment = async () => {
    try {
        const client = await pool.connect();

        //Get departments
        var departments = [];
        let dep = await client.query("SELECT * from department order by id asc");
        if (dep.rowCount < 1) {
            return false;
        }
        for (let k = 0; k < dep.rows.length; k++) {
            let auxUser = [];
            let depAux = {
                id: dep.rows[k].id,
                name: dep.rows[k].name,
                description: dep.rows[k].description,
                users: auxUser
            };
            departments.push(depAux)
        }

        //Get all normal users
        let query = await client.query("SELECT * from normal");
        if (query.rowCount < 1) {
            return false;
        }

        //Get normal users information
        for (let i = 0; i < query.rows.length; i++) {
            let readedUser = await client.query("SELECT * from person WHERE id= $1", [query.rows[i].person_id]);
            if (readedUser.rowCount < 1) {
                return false;
            }
            for (let j = 0; j < readedUser.rows.length; j++) {
                let user = {
                    id: readedUser.rows[j].id,
                    email: readedUser.rows[j].email,
                    displayname: readedUser.rows[j].displayname,
                };
                for (let k = 0; k < departments.length; k++) {
                    if (departments[k].id === readedUser.rows[j].department_id) {
                        console.log(user)
                        departments[k].users.push(user);
                        break;
                    }
                }

            }
        }

        client.release();
        return departments;

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Get all normal users 
 */
exports.getNormalUsers = async () => {
    try {
        const client = await pool.connect();

        //Get departments
        var departments = [];
        let dep = await client.query("SELECT * from department order by id asc");
        if (dep.rowCount < 1) {
            return false;
        }
        for (let k = 0; k < dep.rows.length; k++) {
            let depAux = {
                id: dep.rows[k].id,
                name: dep.rows[k].name,
            };
            departments.push(depAux)
        }

        //Get all normal users
        let query = await client.query("SELECT * from normal");
        if (query.rowCount < 1) {
            return false;
        }

        let usersFinal = [];
        //Get normal users information
        for (let i = 0; i < query.rows.length; i++) {
            let readedUser = await client.query("SELECT * from person WHERE id= $1", [query.rows[i].person_id]);
            if (readedUser.rowCount < 1) {
                return false;
            }
            for (let j = 0; j < readedUser.rows.length; j++) {
                let user = {
                    id: readedUser.rows[j].id,
                    email: readedUser.rows[j].email,
                    displayname: readedUser.rows[j].displayname,
                    departmentID: 0,
                    departmentDescription: ""
                };
                for (let k = 0; k < departments.length; k++) {
                    if (departments[k].id === readedUser.rows[j].department_id) {
                        user.departmentID = departments[k].id;
                        user.departmentDescription = departments[k].name
                        break;
                    }
                }
                usersFinal.push(user);
            }
        }
        client.release();
        return usersFinal;

    } catch (error) {
        throw new Error(error);
    }
}


/**
 * Get all unit managers ordered by department 
 */
exports.getUnitManagersOrderByDepartment = async () => {
    try {
        const client = await pool.connect();

        //Get departments
        var departments = [];
        let dep = await client.query("SELECT * from department order by id asc");
        if (dep.rowCount < 1) {
            return false;
        }
        for (let k = 0; k < dep.rows.length; k++) {
            let auxUser = [];
            let depAux = {
                id: dep.rows[k].id,
                name: dep.rows[k].name,
                description: dep.rows[k].description,
                users: auxUser
            };
            departments.push(depAux)
        }

        //Get all unit managers users
        let query = await client.query("SELECT * from unit_manager");
        if (query.rowCount < 1) {
            return false;
        }

        //Get unit manager information
        for (let i = 0; i < query.rows.length; i++) {
            if (query.rows[i].isactive === true) {
                let readedUser = await client.query("SELECT * from person WHERE id= $1", [query.rows[i].person_id]);
                if (readedUser.rowCount < 1) {
                    return false;
                }
                for (let j = 0; j < readedUser.rows.length; j++) {
                    let user = {
                        id: readedUser.rows[j].id,
                        email: readedUser.rows[j].email,
                        displayname: readedUser.rows[j].displayname,
                    };
                    for (let k = 0; k < departments.length; k++) {
                        if (departments[k].id === readedUser.rows[j].department_id) {
                            //console.log(user)
                            departments[k].users.push(user);
                            break;
                        }
                    }

                }
            }
        }

        client.release();
        return departments;

    } catch (error) {
        throw new Error(error);
    }
}

exports.getAllRequestFromThisYearByMonth = async () => {

    try {
        var requestByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        const client = await pool.connect();
        var thisYear = new Date().getFullYear();
        console.log(thisYear);
        let requests = await client.query("SELECT * from request where EXTRACT(YEAR FROM action_dateofaction) = $1", [thisYear]);

        if (requests.rowCount < 1) {
            return requestByMonth;
        }

        for (var i = 0; i < requests.rowCount; i++) {
            var requestDate = requests.rows[i].action_dateofaction;
            var requestMonth = parseInt(requestDate.getMonth());
            console.log("requestMonth: " + (requestMonth + 1));
            requestByMonth[requestMonth] += 1;
        }

        console.log(requestByMonth);
        return requestByMonth;

    } catch (error) {
        throw new Error(error);
    }
}


exports.getAllReturnRequestsFromThisYearByMonth = async () => {

    try {
        var requestByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        const client = await pool.connect();
        var thisYear = new Date().getFullYear();
        console.log(thisYear);
        let requests = await client.query("SELECT * from return where EXTRACT(YEAR FROM action_dateofaction) = $1", [thisYear]);

        if (requests.rowCount < 1) {
            return requestByMonth;
        }

        for (var i = 0; i < requests.rowCount; i++) {
            var requestDate = requests.rows[i].action_dateofaction;
            var requestMonth = parseInt(requestDate.getMonth());
            console.log("requestMonth: " + (requestMonth + 1));
            requestByMonth[requestMonth] += 1;
        }

        console.log(requestByMonth);
        return requestByMonth;

    } catch (error) {
        throw new Error(error);
    }
}







exports.removeUnitManagerPermission = async (id) => {
    try {
        const client = await pool.connect();
        //update unit_manager table
        await client.query("UPDATE unit_manager SET isactive=FALSE WHERE person_id=$1", [id]);
        //Insert user id into normal table
        await client.query("INSERT INTO normal VALUES($1)", [id])
        client.release();
    } catch (error) {
        throw new Error(error);
    }
}

exports.newUnitManager = async (id) => {
    try {
        const client = await pool.connect();
        //Verify if already exists unit manager record 
        let query = await client.query("SELECT * from unit_manager where person_id=$1", [id]);
        if (query.rowCount < 1) {
            //Insert the information into the unit_manager table
            await client.query("INSERT INTO unit_manager (isactive, person_id) VALUES(TRUE, $1)", [id])
        } else {
            //Update unit_manager table
            await client.query("UPDATE unit_manager SET isactive=TRUE WHERE person_id=$1", [id]);
        }
        //Remove user from normal table
        await client.query("DELETE FROM normal WHERE person_id=$1", [id]);

        client.release();
    } catch (error) {
        throw new Error(error);
    }
}

