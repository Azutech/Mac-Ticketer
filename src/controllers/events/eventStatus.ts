import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const getEventStatus = async (req: Request, res: Response): Promise<any> => {
	const { eventId } = req.query;

	try {
		if (typeof eventId !== 'string') {
			throw new Error ('Invalid eventId format');
		}

		const event = await prisma.event.findUnique({
			where: { id: eventId },
		});

		if (!event) {

            throw new Error ('Event not found');
		}

		const waitingListCount = await prisma.waitingList.count({
			where: { eventId },
		});

		const bookings = await prisma.booking.findMany({
			where: { eventId },
		});

		const bookingStatuses = bookings.map(booking => booking.status);
		const latestBookingStatus = bookingStatuses.includes('confirmed') 
			? 'confirmed' 
			: bookingStatuses.includes('pending') 
			? 'pending' 
			: 'cancelled';

		return res.status(StatusCodes.OK).json({
			eventName: event.name,
			totalTickets: event.totalTickets,
			availableTickets: event.availableTickets,
			waitingListCount,
			latestBookingStatus, 
		});
	} catch (err: any) {
		console.error(err);
		const statusMap: Record<string, number> = {
			'Invalid eventId format ': StatusCodes.BAD_REQUEST,
			'Event not found': StatusCodes.NOT_FOUND,
			
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json({ error: err.message });
	}
};

