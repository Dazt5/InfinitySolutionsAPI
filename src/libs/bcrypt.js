const { hash, genSalt, compare } = require('bcrypt');


exports.hashPassword = async (password) => {

    const salt = await genSalt(10);

    const hashPassword = hash(password, salt);

    return hashPassword;

}


exports.comparePassword = async (password, savedPassword) => {


    return compare(password,savedPassword);

}