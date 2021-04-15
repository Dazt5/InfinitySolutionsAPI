const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const authUser = require('../middlewares/authHandler/authUser');
const authAdmin = require('../middlewares/authHandler/authAdmin');

/*CONTROLLERS*/
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const favoriteController = require('../controllers/favoriteController');

/*ADMINS CONTROLLERS*/
const corporationController = require('../controllers/corporationController');
const statusController = require('../controllers/statusController');

/**VALIDATION SCHEMES */
const {
    signupSchema,
    loginSchema } = require('../libs/schemas/authentication');

const { ticketSchema, idTicketSchema } = require('../libs/schemas/ticket');

const {
    idCorporationSchema,
} = require('../libs/schemas/corporation');



const validationHandler = require('../middlewares/validationHandler');

module.exports = () => {

    /*------- USER ROUTES ---------*/

    /*AUTHENTICATION*/
    router.post('/signup',
        validationHandler(signupSchema),
        authController.signUp
    );

    router.post('/login',
        validationHandler(loginSchema),
        authController.login
    );

    router.post('/activate',
        authController.sendActivatedToken
    );

    router.get('/activate/:token',
        authController.activateAccount
    );

    router.post('/recover',
        authController.sendRecoverToken
    );

    router.get('/recover/:token',
        authController.validateRecoveryToken
    );

    router.post('/recover/:token',
        authController.recoverAccount
    );

    /*TICKETS*/
    router.get('/ticket',
        authUser,
        ticketController.showAllUserTickets
    );

    router.get('/ticket/:idTicket',
        authUser,
        validationHandler(Joi.object({ idTicket: idTicketSchema }), 'params'),
        ticketController.showUserTicket
    );

    router.post('/ticket/new',
        authUser,
        validationHandler(ticketSchema),
        ticketController.newTicket
    );

    /*FAVORITES*/
    router.get('/favorite',
        authUser,
        favoriteController.showFavorite
    );

    router.post('/favorite/new',
        authUser,
        favoriteController.addFavorite
    );

    router.delete('/favorite/:id',
        authUser,
        favoriteController.deleteFavorite
    );

    /*CORPORATION*/
    router.get('/corporation',
        authUser,
        corporationController.showAllCorporation);

    router.get('/corporation/:idCorporation',
        authUser,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        corporationController.showCorporation);

    /*------- ADMIN ROUTES ---------*/

    //* CORPORATION */
    router.post('/corporation/new',
        authAdmin,
        corporationController.uploadPicture,
        corporationController.newCorporation
    );

    router.put('/corporation/:idCorporation',
        authAdmin,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        corporationController.uploadPicture,
        corporationController.editCorporation
    );

    router.delete('/corporation/:idCorporation',
        authAdmin,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        corporationController.deleteCorporation
    );

    /* CORPORATION DOCUMENTS */

    router.get('/corporation/:idCorporation/document',
        authAdmin,
        corporationController.showAllCorporationDocuments
    );

    router.get('/corporation/document/:idDocument',
        authAdmin,
        corporationController.showDocument
    );

    router.post('/corporation/document/new',
        authAdmin,
        corporationController.uploadDocument,
        corporationController.newCorporationDocument
    );

    router.delete('/corporation/document/:idDocument',
        authAdmin,
        corporationController.showDocument
    );

    /*CORPORATION CONTACT INFORMATIÓN*/

    router.get('/corporation/:idCorporation/contact',
        authAdmin,
        corporationController.showAllContactInfo
    );

    router.get('/corporation/contact/:idContact',
        authAdmin,
        corporationController.showContactInfo
    );

    router.post('/corporation/contact/new',
        authAdmin,
        corporationController.validateContactInfo,
        corporationController.newContactInfo
    );

    router.put('/corporation/contact/:idContact',
        authAdmin,
        corporationController.editContactInfo
    );

    router.delete('/corporation/contact/:idContact',
        authAdmin,
        corporationController.deleteContactInfo
    );

    /*STATUS*/

    //TODO GET ROUTE

    router.post('/status/new',
        authAdmin,
        statusController.validateStatus,
        statusController.newStatus
    );

    router.put('/status/:idStatus',
        authAdmin,
        statusController.editStatus
    );
    router.delete('/status/:idStatus',
        authAdmin,
        statusController.deleteStatus)

    return router;
}
