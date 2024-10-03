import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const bookTicket = async (req: Request, res: Response): Promise<any> => {
	const { eventId, userId } = req.body;
	try {
		const result = await prisma.$transaction(async (tx) => {
			const findEvent = await tx.event.findUnique({
				where: { id: eventId },
			});
			if (!findEvent) {
				throw new Error('Event not found');
			}

			const findUser = await tx.user.findUnique({
				where: { id: userId },
			});
			if (!findUser) {
				throw new Error('User not found');
			}

			if (findEvent.availableTickets > 0) {
				const bookingData = await tx.booking.create({
					data: {
						eventId,
						userId,
						status: 'confirmed',
					},
				});

				await tx.event.update({
					where: { id: eventId },
					data: { availableTickets: findEvent.availableTickets - 1 },
				});

				return { message: 'Ticket booked successfully', bookingData };
			} else {
				const waitingData = await tx.waitingList.create({
					data: {
						eventId,
						userId,
					},
				});
				return { message: 'Added to waiting list', waitingData };
			}
		});

		return res.status(StatusCodes.CREATED).json(result);

	} catch (err: any) {
		console.dir(err);

		const statusMap: Record<string, number> = {
			'Event not found': StatusCodes.BAD_REQUEST,
			'User not found': StatusCodes.BAD_REQUEST,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;

		return res.status(statusCode).json({ error: err.message });
	}
};

