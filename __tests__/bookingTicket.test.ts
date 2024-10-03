import request from 'supertest';
import app from '../src/app'; // Adjust the path to your app file
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

describe('bookTicket', () => {
    let eventId: string;
    let userId: string;

    beforeEach(async () => {
        // Create a test event
        const event = await prisma.event.create({
            data: {
                name: 'Test Event',
                totalTickets: 100,
                availableTickets: 10,
            },
        });
        eventId = event.id;

        // Create a test user
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: 'testuser@gmail.com',
            },
        });
        userId = user.id;
    });

    afterEach(async () => {
        // Clean up test data in reverse order of creation to avoid foreign key constraint violations
        await prisma.booking.deleteMany();
        await prisma.waitingList.deleteMany();
        await prisma.event.deleteMany();
        await prisma.user.deleteMany();
    });

    it('should book a ticket successfully', async () => {
        const res = await request(app)
            .post('/api/v1/ticket/bookTickets') // Use the correct endpoint
            .send({
                eventId,
                userId,
            });
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('message', 'Ticket booked successfully');
    });

    it('should add to waiting list when no tickets are available', async () => {
        // Update the event to have no available tickets
        await prisma.event.update({
            where: { id: eventId },
            data: { availableTickets: 0 },
        });

        const res = await request(app)
            .post('/api/v1/ticket/bookTickets') // Use the correct endpoint
            .send({
                eventId,
                userId,
            });
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', 'Added to waiting list');
    });

    it('should return an error when event is not found', async () => {
        const res = await request(app)
            .post('/api/v1/ticket/bookTickets') // Use the correct endpoint
            .send({
                eventId: 'non-existent-event-id',
                userId,
            });
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'Event not found');
    });

    it('should return an error when user is not found', async () => {
        const res = await request(app)
            .post('/api/v1/ticket/bookTickets') // Use the correct endpoint
            .send({
                eventId,
                userId: 'non-existent-user-id',
            });
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return an internal server error when an unexpected error occurs', async () => {
        jest.spyOn(prisma.booking, 'create').mockRejectedValue(new Error('Unexpected error'));

        const res = await request(app)
            .post('/api/v1/ticket/bookTickets') // Use the correct endpoint
            .send({
                eventId,
                userId,
            });
        expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.body).toHaveProperty('error', 'Unexpected error');
    });
});

// Increase Jest timeout if necessary
jest.setTimeout(10000);
