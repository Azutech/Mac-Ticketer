import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const eventclient = new PrismaClient().event;

export const createEvent = async (req: Request, res: Response): Promise<any> => {
	try {
		const { name, totalTickets } = req.body;

		if (!name || typeof name !== 'string' || name.trim() === '') {
			throw new Error ('Invalid event name' );
			
		  }
	  
		  if (!totalTickets || typeof totalTickets !== 'number' || totalTickets <= 0) {
			throw new Error ('Invalid number of tickets' );
			
		  }

		// Create a new event
		const event = await eventclient.create({
			data: {
				name,
				totalTickets,
				availableTickets: totalTickets,
			},
		});

		// If the event was not created successfully, throw an error
		if (!event) {
			throw new Error('Failed to initialize events');
		}

		// Return success response
		res.status(StatusCodes.CREATED).json({ msg: 'Event Initialized', data: event });
	} catch (err: any) {
		// Log and return an error response
		console.dir(err);
		const statusMap: Record<string, number> = {
			'Failed to initialize events ': StatusCodes.BAD_REQUEST,
			'Invalid number of tickets': StatusCodes.BAD_REQUEST,
			'Invalid event name': StatusCodes.BAD_REQUEST,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json({ error: err.message });
	
	}
};
