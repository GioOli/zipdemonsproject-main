const express = require("express");
const router = express.Router();

const adminModel = require("../model/admin");

/*
*
* Database End-points. Just for testing
*
*/

//Criar Tables para Base de Dados
router.post("/admin/populate", adminModel.populateTables);

//Apagar Dados da Base de Dados
router.post("/admin/deletedata", adminModel.deleteTables);
//adicionar ao historico
router.post("/admin/populateHistory", adminModel.populateHistory);

//adicionar pedidos aceites e recusados de items
router.post("/admin/acceptRefuseRequests", adminModel.acceptAndRefuseRequests);

//Devolve o numero de pedidos e pedidos de devolução a cada mês do ano atual
router.get("/admin/getRequestsByMonth", adminModel.getRequestsandReturnRequestsNumberByMonth);



//Devolve o numero de pedidos e pedidos de devolução a cada mês do ano atual
router.get("/admin/getRequestsByMonth", adminModel.getRequestsandReturnRequestsNumberByMonth);


/*
*
* Permission End-points
*
*/

//Devolve lista de utilizadores normais ordenados por departamento
router.get("/admin/getNormalUsersOrderedByDepartment", adminModel.getListOfNormalUsersOrderedByDepartment);

//Devolve lista de utilizadores normais e respetivas informações
router.get("/admin/getNormalUsers", adminModel.getListOfNormalUsers);

//Devolve lista de gestores de unidades ordenados por departamento
router.get("/admin/getUnitManagersOrderedByDepartment", adminModel.getListOfUnitManagerslOrderedByDepartment);

//Remover as permisões de autorizações de um utilizador
//É preciso passar o id do user pelo body através de um JSON
router.post("/admin/removeUnitManagerPermission", adminModel.removeUnitManagerPermission);

//Remover as permisões de autorizações de um utilizador
//É preciso passar o id do user pelo body através de um JSON
router.post("/admin/newUnitManager", adminModel.newUnitManager);






module.exports = router;