const boom = require('@hapi/boom');

function notFoundHandler(req,res){

    const {
        output: {statusCode, payload}
    } = boom.notFound();

    res.status(statusCode).json({
        success:false,
        message: payload.message
    });

}

module.exports = notFoundHandler;