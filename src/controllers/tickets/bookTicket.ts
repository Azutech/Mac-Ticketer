import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const booking = new PrismaClient().booking;
const event = new PrismaClient().event;
const waitingList = new PrismaClient().waitingList;
const user = new PrismaClient().user;

export const bookTicket = async (req: Request, res: Response): Promise<any> => {
	const { eventId, userId } = req.body;
	try {
		const findevent = await event.findUnique({ where: { id: eventId } });
		if (!findevent) {
			throw new Error('Event not found');
		}
		const finduser = await user.findUnique({ where: { id: userId } });
		if (!finduser) {
			throw new Error('User not found');
		}

		if (findevent.availableTickets > 0) {
			await booking.create({
				data: {
					eventId,
					userId,
					status: 'confirmed',
				},
			});
			await event.update({
				where: { id: eventId },
				data: { availableTickets: findevent.availableTickets - 1 },
			});
			return res
				.status(StatusCodes.CREATED)
				.json({ message: 'Ticket booked successfully' });
		} else {
			await waitingList.create({
				data: {
					eventId,
					userId,
				},
			});
			return res.status(200).json({ message: 'Added to waiting list' });
		}
	} catch (err: any) {
		console.dir(err);
		const statusMap: Record<string, number> = {
			'Event not found ': StatusCodes.BAD_REQUEST,
			'User not found': StatusCodes.BAD_REQUEST,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json({ error: err.message });
	}
};
