import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const cancelBooking = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { bookingId } = req.body;

	try {
		// Find the booking
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
		});

		if (!booking) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'Booking not found' });
		}

		await prisma.booking.update({
			where: { id: bookingId },
			data: { status: 'cancelled' },
		});

		const event = await prisma.event.findUnique({
			where: { id: booking.eventId },
		});
		if (!event) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'Event not found' });
		}

		const nextInLine = await prisma.waitingList.findFirst({
			where: { eventId: booking.eventId },
			orderBy: { createdAt: 'asc' },
		});

		if (nextInLine) {
			await prisma.booking.create({
				data: {
					eventId: booking.eventId,
					userId: nextInLine.userId,
					status: 'confirmed',
				},
			});

			// Remove the user from the waiting list
			await prisma.waitingList.delete({
				where: { id: nextInLine.id },
			});

			res.status(StatusCodes.OK).json({
				message:
					'Booking cancelled, ticket assigned to next user in waiting list',
			});
		} else {
			// No one in the waiting list, increase available tickets
			await prisma.event.update({
				where: { id: booking.eventId },
				data: { availableTickets: event.availableTickets + 1 },
			});

			res.status(StatusCodes.OK).json({
				message: 'Booking cancelled, ticket returned to pool',
			});
		}
	} catch (error) {
		console.error(error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Failed to cancel booking',
		});
	}
};
