require('dotenv').config({ path: '.env' });
const { sign, decode } = require('jsonwebtoken');

const SECRETKEY = process.env.ENCRYPTKEY;

exports.getToken = async (email) => {

    const token = sign({ email },
        SECRETKEY,
        { expiresIn: '1d' });

    return token;
};

exports.decodeToken = (token) => {


    var tokenDecoded = decode(token,
        { complete: true }
    );

    return tokenDecoded.payload;

}
