import { Router } from 'express';
import { createEvent, getEventStatus } from '../controllers/events';

export const events = Router();

events.post('/initializeEvents', createEvent);
events.get('/getEventStatus', getEventStatus);
