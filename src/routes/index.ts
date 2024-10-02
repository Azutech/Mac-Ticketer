import { Router } from 'express';
import { events } from './events';
import { user } from './users';



export const routes: Router = Router();

routes.use('/events', events);
routes.use('/user', user);
