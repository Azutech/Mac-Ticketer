import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
	try {
		// Retrieve all bookings, including related user and event details
		const bookings = await prisma.booking.findMany({
			include: {
				user: true,   // Include user details
				event: true,  // Include event details
			},
		});

        if (bookings.length === 0)  {
            throw new Error (' No Booking Tickets found')
        }

		// Return the list of bookings
		return res.status(StatusCodes.OK).json({
			message: 'All bookings retrieved successfully',
			data: bookings,
		});
	} catch (err: any) {

        console.dir(err);

		const statusMap: Record<string, number> = {
			'No Booking Tickets found': StatusCodes.BAD_REQUEST,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;

		return res.status(statusCode).json({ error: err.message });

	}
};
