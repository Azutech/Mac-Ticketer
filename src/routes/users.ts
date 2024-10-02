import { Router } from 'express';
import { createUser } from '../controllers/user';


export const user = Router();

user.post('/createUser', createUser)