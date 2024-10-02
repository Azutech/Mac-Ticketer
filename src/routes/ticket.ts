import { Router } from 'express';
import { bookTicket, cancelBooking } from '../controllers/tickets';

export const ticket: Router = Router();

ticket.post('/bookTickets', bookTicket);
ticket.post('/cancelBooking', cancelBooking);
