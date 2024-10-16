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


## Installation

To install the project, follow these steps:

-  Clone the repository: `git clone https://github.com/Azutech/Mac-Ticketer.git`
-  Change to the project directory: `cd project`
-  Install the dependencies: `npm install`
-  Run the project: `npm run dev`


## Contributing

To contribute to the project, you can:

- Fork the repository
- Create a new branch: `git checkout -b feature-name`
- Make your changes and commit them: `git commit -m "Add feature-name"`
- Push to your branch: `git push origin feature-name`
- Create a pull request




 ## PostMan Documentation

 Click this [link](https://documenter.getpostman.com/view/19569197/2sAXqqd3QU#5da4db40-b7a1-42dd-9b86-dcf98d94cdb7) to get the full API Documentation 


## License



[MIT] ()
The project is licensed under the MIT license.

Copyright (c) [2024] [EmmanuelOnugha]
