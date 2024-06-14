## Introduction

This project is a REST application built using the NestJS framework. The application performs CRUD operations and communicates with an external API (https://reqres.in/) for retrieving user data. It uses MongoDB for data storage, RabbitMQ for messaging, and SendGrid for sending emails.

## Prerequisites

Ensure you have the following installed:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (v4.4 or later)
- RabbitMQ (v3.7 or later)
- TypeScript (v3.4 or later)

## Installation

1. Install dependencies using npm:

    ```bash
    npm install
    ```

3. Update the `local.env` file with missing values for Database Configuration and AWS Keys. Below are the environment variables that need to be set:

    ```plaintext
    MONGO_URI=mongodb://localhost:27017/nestjs
    SENDGRID_API_KEY=your_sendgrid_api_key
    RABBITMQ_URI=amqp://localhost:5672
    ```

4. Start MongoDB and RabbitMQ services if they are not already running. Run the application locally using the following command:

    ```bash
    mongod
    rabbitmq-server
    npm run start:local
    ```

Now, the application should be up and running locally.

## Usage

You can access the API documentation through Swagger UI by navigating to:

[http://localhost:3000/docs](http://localhost:3000/docs)
