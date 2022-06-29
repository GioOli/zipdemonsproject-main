const adminController = require("../controllers/admin");

exports.deleteTables = async (req, res) => {

    try {

        await adminController.deleteTables();
        res.json({ hey: "yo" });

    } catch (error) {
        throw new Error(error)
    }
};

exports.populateHistory = async (req, res) => {
    try {
        await adminController.populateHistory();
        res.json({ res: "Done" })
    } catch (error) {
        throw new Error(error)
    }
}

exports.populateTables = async (req, res) => {
    try {
        await adminController.populateTables();
        res.json({ hey: "Populated" });

    } catch (error) {
        throw new Error(error)
    }
};

exports.acceptAndRefuseRequests = async (req, res) => {
    try {
        await adminController.acceptAndRefuseRequests();
        res.json({ res: "Pedidos criados, aceites e recusados para o David" });

    } catch (error) {
        throw new Error(error)
    }
};




exports.getListOfNormalUsersOrderedByDepartment = async (req, res) => {

    try {
        var users = await adminController.getNormalUsersOrderByDepartment();
        return res.json(users);

    } catch (error) {
        console.log('Get users ordered by department failed!');
        console.log(error)
        return res.sendStatus(401);
    }
};


exports.getListOfNormalUsers = async (req, res) => {
    try {
        var users = await adminController.getNormalUsers();
        return res.json(users);

    } catch (error) {
        console.log('Get users  failed!');
        console.log(error)
        return res.sendStatus(401);
    }
};


exports.getListOfUnitManagerslOrderedByDepartment = async (req, res) => {
    try {
        var users = await adminController.getUnitManagersOrderByDepartment();
        return res.json(users);
    } catch (error) {
        console.log('Get unit managers ordered by department failed!');
        console.log(error)
        return res.sendStatus(401);
    }
};

exports.removeUnitManagerPermission = async (req, res) => {
    try {
        console.log(req.body.id)
        await adminController.removeUnitManagerPermission(req.body.id);
        return res.sendStatus(200);
    } catch (error) {
        console.log('Error removing unit_manager!');
        console.log(error)
        return res.sendStatus(401);
    }
};

exports.newUnitManager = async (req, res) => {
    try {
        await adminController.newUnitManager(req.body.id);
        return res.sendStatus(200);
    } catch (error) {
        console.log('Error removing unit_manager!');
        console.log(error)
        return res.sendStatus(401);
    }
};




exports.getRequestsandReturnRequestsNumberByMonth = async (req, res) => {

    try {

        var requestsByMonth = await adminController.getAllRequestFromThisYearByMonth();
        var returnRequestsByMonth = await adminController.getAllReturnRequestsFromThisYearByMonth();

        var toReturn = {
            requests: requestsByMonth,
            returnRequests: returnRequestsByMonth
        }

        return res.json(toReturn);

    } catch (error) {
        throw new Error(error);
    }
}


