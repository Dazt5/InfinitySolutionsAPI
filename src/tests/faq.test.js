const db = require('./db');
const Faq = require('../models/Faq');
const { faqMock } = require('./mocks/faq');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('FAQ INTEGRATION TEST', () => {

    it('SUCCESSFULL_CREATE_FAQ', async () => {
        const faq = new Faq(faqMock);
        const savedFaq= await faq.save();
        expect(savedFaq).not.toBeNull();
        expect(savedFaq.corporation).toEqual(savedFaq.corporation);
    });

});