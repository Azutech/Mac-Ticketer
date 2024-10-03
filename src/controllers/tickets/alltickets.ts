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

		// Return the list of bookings
		return res.status(StatusCodes.OK).json({
			message: 'All bookings retrieved successfully',
			data: bookings,
		});
	} catch (error) {
		console.error(error);

		// Return an error response if the query fails
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Failed to retrieve bookings',
		});
	}
};
