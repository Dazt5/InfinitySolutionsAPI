const db = require('./db');
const Favorite = require('../models/Favorite');
const { favoriteMock } = require('./mocks/favoriteMock');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('FAVORITE INTEGRATION TEST', () => {

    it('SUCCESSFULL_ADDED_FAVORITE', async () => {
        const favorite = new Favorite(favoriteMock);
        const savedFavorite = await favorite.save();
        expect(savedFavorite).not.toBeNull();
        expect(savedFavorite.user).toEqual(savedFavorite.user);
    });

});