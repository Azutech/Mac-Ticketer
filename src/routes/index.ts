import { Router } from 'express';
import { events } from './events';
import { user } from './users';
import { ticket } from './ticket';

export const routes: Router = Router();

routes.use('/events', events);
routes.use('/user', user);
routes.use('/ticket', ticket);
