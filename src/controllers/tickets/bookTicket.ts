import  { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const booking = new PrismaClient().booking;
const prisma = new PrismaClient().event;





const bookTicket = async (req: Request, res: Response) => {
    const { eventId, userId } = req.body;
    try {
        const event = await prisma.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.availableTickets > 0) {
            await booking.create({
                data: {
                    eventId,
                    userId,
                    status: 'confirmed'
                }
            });
            await prisma.update({
                where: { id: eventId },
                data: { availableTickets: event.availableTickets - 1 }
            });
            return res.status(200).json({ message: 'Ticket booked successfully' });
        } else {
            // await prisma.waitingList.create({
            //     data: {
            //         eventId,
            //         userId
            //     }
            // });
            // return res.status(200).json({ message: 'Added to waiting list' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to book ticket' });
    }
};