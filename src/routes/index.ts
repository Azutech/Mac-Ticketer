import { Router } from 'express';
import { events } from './events';


export const routes: Router = Router();

routes.use('/events', events);
