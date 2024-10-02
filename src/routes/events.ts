import { Router } from 'express';
import { createEvent } from '../controllers/events';

export const events = Router();

events.post('/initializeEvents', createEvent);
