import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const cancelBooking = async (req: Request, res: Response): Promise<any> => {
	const { bookingId } = req.body;

	try {
		// Start transaction
		const result = await prisma.$transaction(async (tx) => {
			// Find the booking
			const booking = await tx.booking.findUnique({
				where: { id: bookingId },
			});

			if (!booking) {
				throw new Error('Booking not found');
			}

			// Cancel the booking by updating the status
			await tx.booking.update({
				where: { id: bookingId },
				data: { status: 'cancelled' },
			});

			// Fetch event details
			const event = await tx.event.findUnique({
				where: { id: booking.eventId },
			});

			if (!event) {
				throw new Error('Event not found');
			}

			// Check if there's someone in the waiting list for the event
			const nextInLine = await tx.waitingList.findFirst({
				where: { eventId: booking.eventId },
				orderBy: { createdAt: 'asc' }, // Get the earliest waiting user
			});

			if (nextInLine) {
				// Assign the ticket to the next user in the waiting list
				await tx.booking.create({
					data: {
						eventId: booking.eventId,
						userId: nextInLine.userId,
						status: 'confirmed',
					},
				});

				await tx.waitingList.delete({
					where: { id: nextInLine.id },
				});

				// Return message for response
				return 'Booking cancelled, ticket assigned to next user in waiting list';
			} else {
				// Increase the available tickets if no one is in the waiting list
				await tx.event.update({
					where: { id: booking.eventId },
					data: { availableTickets: event.availableTickets + 1 },
				});

				// Return message for response
				return 'Booking cancelled, ticket returned to pool';
			}
		});

		// Send response after transaction completes
		res.status(StatusCodes.OK).json({ message: result });
	} catch (err: any) {
		console.dir(err);

		// Custom status codes for specific errors
		const statusMap: Record<string, number> = {
			'Booking not found': StatusCodes.NOT_FOUND,
			'Event not found': StatusCodes.NOT_FOUND,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;

		return res.status(statusCode).json({ error: err.message });
	}
};
