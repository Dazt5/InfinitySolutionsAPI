const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');

/*CONTROLLERS*/
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const favoriteController = require('../controllers/favoriteController');

/*ADMINS CONTROLLERS*/
const corporationController = require('../controllers/corporationController');
const statusController = require('../controllers/statusController');

module.exports = () => {

    /*------- USER ROUTES ---------*/

    /*AUTHENTICATION*/
    router.post('/signup/',
        authController.validateSignup,
        authController.signUp
    );

    router.post('/login/',
        authController.validateLogin,
        authController.login
    );

    router.post('/activate/',
        authController.sendActivatedToken
    );

    router.get('/activate/:token',
        authController.activateAccount
    );

    router.post('/recover/',
        authController.sendRecoverToken
    );

    router.get('/recover/:token',
        authController.validateRecoveryToken
    );

    router.post('/recover/:token',
        authController.recoverAccount
    );

    /*TICKETS*/
    router.get('/ticket/',
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
    router.get('/favorite/',
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

    /*CORPORATION CONTACT INFORMATIÓN*/

    router.get('/corporation/:id/contact/',
        authAdmin,
        corporationController.showAllContactInfo
    );

    router.get('/corporation/contact/:id',
        authAdmin,
        corporationController.showContactInfo
    );

    router.post('/corporation/contact/new',
        authAdmin,
        corporationController.validateContactInfo,
        corporationController.newContactInfo
    );

    router.delete('/corporation/contact/:id/',
        authAdmin,
        corporationController.deleteContactInfo
    );

    router.put('/corporation/contact/:id/',
        authAdmin,
        corporationController.validateContactInfo,
        corporationController.editContactInfo
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
