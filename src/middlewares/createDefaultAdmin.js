/*
check if there is an admin account, 
if it does not exist then create one with default credentials.
*/

/*MONGO SCHEMA */
const User = require('../models/User');
const { hashPassword } = require('../libs/bcrypt');

const createDefaultAdmin = async () => {

    const user = await User.findOne({
        auth_level: 2
    });

    if (!user) {
        const defaultCredentials = {
            email: 'admin@infinitySolutions.com',
            password: await hashPassword('Adminpassword1'),
            fullname: 'MASTER ADMIN',
            phone_number: '04146863670',
            activated: 1,
            auth_level: 2
        }

        const admin = new User(defaultCredentials);

        await admin.save();
    }
}

createDefaultAdmin();
