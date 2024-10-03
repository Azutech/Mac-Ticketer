# Event Ticket Booking System

This project implements a **RESTful API** for an event ticket booking system built using **Node.js** with **Express.js** and **Prisma ORM**. It supports the following core functionalities:

1. Initialize an event with a set number of available tickets.
2. Allow users to book tickets concurrently.
3. Implement a waiting list for when tickets are sold out.
4. View available tickets and the waiting list.
5. Handle ticket cancellations and automatically assign tickets to waiting list users.
6. Save the event, booking, and waiting list data in an RDBMS (PostgreSQL or MySQL).

## Features

- **Concurrency Handling**: Ensures thread-safe operations with Prisma transactions for booking and cancellations.
- **Waiting List Management**: Automatically promotes users from the waiting list when tickets become available.
- **Express.js Middleware**: Handles JSON parsing and API routing efficiently.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building the app.
- **Express.js**: Web framework used to create API routes and handle middleware.
- **Prisma**: ORM for interacting with the RDBMS (PostgreSQL or MySQL).
- **PostgreSQL / MySQL**: Relational databases supported for storing event and booking data.