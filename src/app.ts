import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from 'dotenv';

config();

import { routes } from './routes';

 const app: Application = express();

app.use(express.json());
//
app.use('/api/v1', routes);
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({ msg: 'Welcome To Mac-Ticketer 🎫🎫' });
});

app.get('*', (req: Request, res: Response) => {
	res.status(StatusCodes.NOT_FOUND).json({ message: 'route not found 🔎' });
});



export default app 
