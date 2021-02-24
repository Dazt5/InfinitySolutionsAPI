const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

/*CONTROLLERS*/
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const favoriteController = require('../controllers/favoriteController');

/*ADMINS CONTROLLERS*/
const corporationController = require('../controllers/corporationController');
const statusController = require('../controllers/statusController');

module.exports = () => {

    /*     USER ROUTES      */ 

    router.post('/signup',
        userController.validateSignup,
        userController.signUp
    );

    router.post('/login',
        userController.validateLogin,
        userController.login
    );

    /*TICKETS*/
    router.get('/ticket',
        auth,
        ticketController.showUserTickets
    );

    router.get('/ticket/:id',
        auth,
        ticketController.userTicket
    );

    router.post('/ticket/new',
        auth,
        ticketController.validateTicket,
        ticketController.newTicket
    );

    /*FAVORITES*/

    router.get('/favorite',
        auth,
        favoriteController.showFavorite
    );

    router.post('/favorite/new',
        auth,
        favoriteController.addFavorite
    );

    /*
        router.put('/ticket/:id',
            auth,
            ticketController.validateTicket,
            ticketController.editTicket
        );
    
        router.delete('/delete/:id',
            auth);
    */


    /*      ADMIN ROUTES        */

    //Corporation
    router.post('/corporation/new',
        authAdmin,
        corporationController.validateCorporation,
        corporationController.newCorporation);

    router.put('/corporation/:id',
        authAdmin,
        corporationController.validateCorporation,
        corporationController.editCorporation
    );

    router.delete('/corporation/:id',
        authAdmin,
        corporationController.deleteCompany
    );

    //Status
    router.post('/status/new',
        authAdmin,
        statusController.validateStatus,
        statusController.newStatus
    );
    router.put('/status/:id',
        authAdmin,
        statusController.editStatus
    );
    router.delete('/status/:id',
        authAdmin,
        statusController.deleteStatus)

    return router;
}
