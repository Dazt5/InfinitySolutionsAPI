const db = require('./db');
const Tickets = require('../models/Tickets');
const { ticketMock } = require('./mocks/ticket');


beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('TICKET INTEGRATION TEST', () => {
    
    it('SUCCESSFULL_CREATE_TICKET', async () => {
        const newTicket = new Tickets(ticketMock)
        const savedTicket = await newTicket.save();
        expect(savedTicket).not.toBeNull();
        expect(savedTicket.subject).toEqual(ticketMock.subject);
    });

});