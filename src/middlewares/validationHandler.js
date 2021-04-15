const boom = require('@hapi/boom');

function validate(data, schema) {
    const { error } = schema.validate(data);
    return error;
}

function validationHandler(schemas, check = "body") {

    return function (req, res, next) {
        const error = validate(req[check], schemas);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }

        next();
    }
}

module.exports = validationHandler;