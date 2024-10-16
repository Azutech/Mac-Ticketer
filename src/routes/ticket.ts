import { Router } from 'express';
import { bookTicket, cancelBooking, getAllBookings } from '../controllers/tickets';

export const ticket: Router = Router();

ticket.post('/bookTickets', bookTicket);
ticket.post('/cancelBooking', cancelBooking);
ticket.get('/getAllBookings', getAllBookings);
