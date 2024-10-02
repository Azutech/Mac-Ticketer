import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from 'dotenv';


config();

import { PORT } from './utils/config';
import { routes } from './routes';

const server: Application = express();

server.use(express.json());
//
server.use('/api/v1', routes);
server.use(express.urlencoded({ extended: true }));

server.get('/', (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({ msg: 'Welcome To Mac-Ticketer 🎫🎫' });
});

server.get('*', (req: Request, res: Response) => {
	res.status(StatusCodes.NOT_FOUND).json({ message: 'route not found 🔎' });
});

server.listen(PORT, () => {
	console.log(`Mac-Ticketer is listening at http://localhost:${PORT} 🚀🚀`);
});

export default { server };
