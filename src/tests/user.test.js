const db = require('./db');
const User = require('../models/User');
const { hashPassword } = require('../libs/bcrypt');
const { userMock } = require('./mocks/user');

let password;

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('AUTHENTICATION INTEGRATION TEST', () => {

    it('SUCCESSFULL_SIGNUP_USER', async () => {
        const user = new User(userMock)
        user.password = await hashPassword(userMock.password);
        password = user.password;
        const savedUser = await user.save();
        expect(savedUser).not.toBeNull();
        expect(savedUser.email).toEqual(userMock.email);
    });

    it('SUCCESSFULL_LOGIN_USER', async () => {
        const searchUser = await User.findOne({
            email: userMock.email
        });
        expect(searchUser.email).toEqual(userMock.email);
        expect(searchUser.password).toEqual(password);
    });
})