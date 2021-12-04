const db = require('./db');
const Corporation = require('../models/Corporation');
const { corporationMock } = require('./mocks/corporation');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('CORPORATION INTEGRATION TEST', () => {

    it('SUCCESSFULL_CREATE_CORPORATION', async () => {
        const corporation = new Corporation(corporationMock);
        const savedCorporation = await corporation.save();
        expect(savedCorporation).not.toBeNull();
        expect(savedCorporation.name).toEqual(corporationMock.name);
    });

});