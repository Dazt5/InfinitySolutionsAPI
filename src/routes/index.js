const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');

/*CONTROLLERS*/
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const favoriteController = require('../controllers/favoriteController');

/*ADMINS CONTROLLERS*/
const corporationController = require('../controllers/corporationController');
const statusController = require('../controllers/statusController');

module.exports = () => {

    /*------- USER ROUTES ---------*/
    
    /*AUTHENTICATION*/ 
    router.post('/signup',
        userController.validateSignup,
        userController.signUp
    );

    router.post('/login',
        userController.validateLogin,
        userController.login
    );

    router.get('/activate/:id',
        userController.activateAccount);

    /*TICKETS*/
    router.get('/ticket',
        authUser,
        ticketController.showAllUserTickets
    );

    router.get('/ticket/:id',
        authUser,
        ticketController.showUserTicket
    );

    router.post('/ticket/new',
        authUser,
        ticketController.validateTicket,
        ticketController.newTicket
    );

    /*FAVORITES*/
    router.get('/favorite',
        authUser,
        favoriteController.showFavorite
    );

    router.post('/favorite/new',
        authUser,
        favoriteController.validateFavorite,
        favoriteController.addFavorite
    );

    router.delete('/favorite/:id',
        authUser,
        favoriteController.deleteFavorite
    );

    /*CORPORATION*/
    router.get('/corporation/',
        authUser,
        corporationController.showAllCorporation);

    router.get('/corporation/:id',
        authUser,
        corporationController.showCorporation);

    /*
        router.put('/ticket/:id',
            authUser,
            ticketController.validateTicket,
            ticketController.editTicket
        );
    
        router.delete('/delete/:id',
            auth);
    */


    /*------- ADMIN ROUTES ---------*/

    //* CORPORATION */
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

    /*STATUS*/
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
