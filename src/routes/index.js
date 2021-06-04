const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const authUser = require('../middlewares/authHandler/authUser');
const authAdmin = require('../middlewares/authHandler/authAdmin');

/*CONTROLLERS*/
const authController = require('../controllers/authController');
const ticketController = require('../controllers/ticketController');
const favoriteController = require('../controllers/favoriteController');
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');

/*ADMINS CONTROLLERS*/
const corporationController = require('../controllers/corporationController');
const faqController = require('../controllers/faqController');
const statusController = require('../controllers/statusController');
const documentController = require('../controllers/documentController');

/**VALIDATION SCHEMES */
const {
    signupSchema,
    loginSchema,
    recoverAccountSchema,
} = require('../libs/schemas/authentication');


const {
    userEmailSchema,
    idUserSchema,
    changePasswordSchema,
    changeProfileSchema
} = require('../libs/schemas/user');

const {
    ticketSchema,
    idTicketSchema,
    responseTicketSchema
} = require('../libs/schemas/ticket');

const {
    idCorporationSchema,
    idDocumentSchema,
    idFavoriteSchema,
    idContactSchema,
    contactSchema
} = require('../libs/schemas/corporation');

const {
    idFaqSchema,
    faqSchema
} = require('../libs/schemas/faq');

const {
    idStatusSchema,
    statusSchema
} = require('../libs/schemas/status');

/**VALIDATION HANDLER*/
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
        validationHandler(recoverAccountSchema),
        authController.recoverAccount
    );

    /*USER*/

    router.get('/user',
        authUser,
        userController.getUser
    );

    router.post('/change/password',
        authUser,
        validationHandler(changePasswordSchema),
        userController.changePassword
    );

    router.patch('/change/profile',
        authUser,
        validationHandler(changeProfileSchema),
        userController.changeProfile
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

    router.post('/ticket/:idTicket/response',
        authUser,
        validationHandler(Joi.object({ idTicket: idTicketSchema }), 'params'),
        validationHandler(responseTicketSchema),
        ticketController.addTicketResponse
    );

    router.get('/ticket/:idTicket/response',
        authUser,
        validationHandler(Joi.object({ idTicket: idTicketSchema }), 'params'),
        ticketController.getTicketsResponse
    );

    /*FAVORITES*/
    router.get('/favorite',
        authUser,
        favoriteController.showFavorites
    );

    router.post('/favorite/new',
        authUser,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema })),
        favoriteController.addFavorite
    );

    router.delete('/favorite/:idFavorite',
        authUser,
        validationHandler(Joi.object({ idFavorite: idFavoriteSchema }), 'params'),
        favoriteController.deleteFavorite
    );

    /*CORPORATION*/
    router.get('/corporation',
        authUser,
        corporationController.showAllCorporation
    );

    router.get('/corporation/:idCorporation',
        authUser,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        corporationController.showCorporation
    );

    router.get('/corporation/:idCorporation/FAQ',
        authUser,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        faqController.getFaqs
    );

    router.get('/chat',
        authUser,
        chatController.joinChat,
    );

    router.post('/chat',
        authUser,
        chatController.sendMessage
    );

    /*------- ADMIN ROUTES ---------*/

    router.get('/user/profile/:userId',
        authAdmin,
        validationHandler(Joi.object({ userId: idUserSchema }), 'params'),
        userController.getUserById
    );

    router.get('/user/search/:email',
        authAdmin,
        validationHandler(Joi.object({ email: userEmailSchema }), 'params'),
        userController.getUserByEmail
    );

    //* ADMIN TICKETS */
    router.patch('/ticket/:idTicket',
        authAdmin,
        validationHandler(Joi.object({ idTicket: idTicketSchema }), 'params'),
        ticketController.changeTicketStatus
    );

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
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        documentController.showDocuments
    );

    router.get('/corporation/document/:idDocument',
        authAdmin,
        validationHandler(Joi.object({ idDocument: idDocumentSchema }), 'params'),
        documentController.showDocument
    );

    router.post('/corporation/document/new',
        authAdmin,
        documentController.uploadDocument,
        documentController.newDocument
    );

    router.delete('/corporation/document/:idDocument',
        authAdmin,
        validationHandler(Joi.object({ idDocument: idDocumentSchema }), 'params'),
        documentController.deleteDocument
    );

    /*DOWNLOAD DOCUMENT*/

    router.get('/document/:file',
        authAdmin,
        documentController.sendDocument
    );

    /*CORPORATION CONTACT INFORMATIÓN*/

    router.get('/corporation/:idCorporation/contact',
        authAdmin,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        corporationController.showAllContactInfo
    );

    router.get('/corporation/contact/:idContact',
        authAdmin,
        validationHandler(Joi.object({ idContact: idContactSchema }), 'params'),
        corporationController.showContactInfo
    );

    router.post('/corporation/contact/new',
        authAdmin,
        validationHandler(contactSchema),
        corporationController.newContactInfo
    );

    router.put('/corporation/contact/:idContact',
        authAdmin,
        validationHandler(Joi.object({ idContact: idContactSchema }), 'params'),
        validationHandler(contactSchema),
        corporationController.editContactInfo
    );

    router.delete('/corporation/contact/:idContact',
        authAdmin,
        validationHandler(Joi.object({ idContact: idContactSchema }), 'params'),
        corporationController.deleteContactInfo
    );

    //CORPORATION FAQ

    router.get('/corporation/FAQ/:idFaq',
        authUser,
        validationHandler(Joi.object({ idFaq: idFaqSchema }), 'params'),
        faqController.getOneFaq
    );

    router.post('/corporation/:idCorporation/FAQ',
        authAdmin,
        validationHandler(Joi.object({ idCorporation: idCorporationSchema }), 'params'),
        validationHandler(faqSchema),
        faqController.newFaq,
    );

    router.put('/corporation/FAQ/:idFaq',
        authAdmin,
        validationHandler(Joi.object({ idFaq: idFaqSchema }), 'params'),
        validationHandler(faqSchema),
        faqController.editFaq
    );

    router.delete('/corporation/FAQ/:idFaq',
        authAdmin,
        validationHandler(Joi.object({ idFaq: idFaqSchema }), 'params'),
        faqController.deleteFaq
    );


    /*STATUS*/

    router.get('/status',
        authAdmin,
        statusController.getStatuses
    );

    router.get('/status/:idStatus',
        authAdmin,
        validationHandler(Joi.object({ idStatus: idStatusSchema }), 'params'),
        statusController.getStatus
    );

    router.post('/status/new',
        authAdmin,
        validationHandler(statusSchema),
        statusController.validateStatus,
        statusController.newStatus
    );

    router.put('/status/:idStatus',
        authAdmin,
        validationHandler(Joi.object({ idStatus: idStatusSchema }), 'params'),
        validationHandler(statusSchema),
        statusController.editStatus
    );
    router.delete('/status/:idStatus',
        authAdmin,
        validationHandler(Joi.object({ idStatus: idStatusSchema }), 'params'),
        statusController.deleteStatus
    );

    return router;
}
