import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../src/app'; // Adjust the path to your app file

describe('Mac-Ticketer app', () => {
    it('should return a welcome message on GET /', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty('msg', 'Welcome To Mac-Ticketer 🎫🎫');
        console.log('Test passed: should return a welcome message on GET /');
    });

    it('should return a 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty('message', 'route not found 🔎');
        console.log('Test passed: should return a 404 for unknown routes');
    });
});