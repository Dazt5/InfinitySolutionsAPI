/*
check if there is an admin account, 
if it does not exist then create one with default credentials.
*/

/*MONGO SCHEMA */
const User = require('../models/User');
const Status = require('../models/Status');
const { hashPassword } = require('../libs/bcrypt');

const createDefaultAdmin = async () => {

    const user = await User.findOne({
        auth_level: 2
    });

    if (!user) {
        const defaultCredentials = {
            email: 'admin@infinitySolutions.com',
            password: await hashPassword('Adminpassword1'),
            name: 'MASTER ADMIN',
            lastname: 'MASTER ADMIN',
            phone_number: '04146863670',
            activated: 1,
            auth_level: 2
        }

        const admin = new User(defaultCredentials);

        await admin.save();
        console.log("USUARIO ADMINISTRADOR CREADO AUTOMÁTICAMENTE")
    }
}

const createDefaultStatus = async () => {
    try {
        const waitingStatus = await Status.findOne({
            name:"waiting"
        })

        if (!waitingStatus) {
            const status = new Status({
                name: "waiting",
                default:1
            });
            await status.save();
            console.log("STATUS WAITING CREADO AUTOMÁTICAMENTE")
        }

        const rejectedStatus = await Status.findOne({
            name:"rejected"
        })

        if (!rejectedStatus) {
            const status = new Status({
                name: "rejected",
            });
            await status.save();
            console.log("STATUS REJECTED CREADO AUTOMÁTICAMENTE")
        }

        const successStatus = await Status.findOne({
            name:"success"
        })

        if (!successStatus) {
            const status = new Status({
                name: "success",
            });
            await status.save();
            console.log("STATUS SUCCESS CREADO AUTOMÁTICAMENTE")
        }


    } catch (error) {
        console.log(error);
    }

}
createDefaultStatus();
createDefaultAdmin();
