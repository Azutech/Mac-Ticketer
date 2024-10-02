import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient().user;

export const createUser = async (req: Request, res: Response): Promise<any> => {
	try {
		const { email, name } = req.body;

		if (!name || typeof name !== 'string' || name.trim() === '') {
			throw new Error('Invalid event name');
		}

		if (!email || typeof email !== 'string' || name.trim() === '') {
			throw new Error('Invalid number of email');
		}

		const user = await prisma.create({
			data: {
				email,
				name,
			},
		});

		if (!user) {
			throw new Error('Failed to create Users');
		}

		return res
			.status(StatusCodes.CREATED)
			.json({ message: 'User created', data: user });
	} catch (err: any) {
		if (err.code === 'P2002') {
			// Prisma unique constraint error
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: 'A user with this email already exists' });
		}
		const statusMap: Record<string, number> = {
			'Invalid event name': StatusCodes.BAD_REQUEST,
			'Invalid event email': StatusCodes.BAD_REQUEST,
		};

		const statusCode = statusMap[err.message]
			? statusMap[err.message]
			: StatusCodes.INTERNAL_SERVER_ERROR;
		return res.status(statusCode).json({ error: err.message });
	}
};
