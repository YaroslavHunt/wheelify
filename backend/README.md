# Backend Overview

The backend of this application is built using **NestJS**, a Node.js framework for building scalable and efficient server-side applications.  
The backend interacts with a **PostgreSQL** database via **Sequelize ORM** to handle and store data.

## Backend Components:
- **NestJS**: For organizing business logic and API routes.
- **Sequelize ORM**: For working with the database.
- **PostgreSQL**: As the database management system.


## Environment Configuration

The application uses a `.env` file to store all environment variables, such as database configurations and other important parameters.  
For convenience, a sample `.env-example` file is provided, which you should copy to `.env` and fill in with the appropriate values for your environment.

```bash
  cp .env-example .env
```

## Creating the Administrator (Seeding)

The backend has a mechanism to automatically create an administrator account if one does not already exist in the database.  
This is done using the configuration data from the `.env` file:

- **`ADMIN_USERNAME`**: The administrator's username.
- **`ADMIN_EMAIL`**: The administrator's email.
- **`ADMIN_PASSWORD`**: The administrator's password.

The seeding script checks if an administrator already exists. If not, a new account is created.

To run the script for creating the administrator, use the following command:

```bash
  npm run seed:admin
```

## Database Initialization

The database is automatically initialized using Sequelize, which synchronizes models with database tables.  
This configuration ensures the database structure is aligned with the models defined in the application.

```ts
synchronize: mode === Mode.DEV;  // synchronization is enabled only in development mode
```
During the application startup, Sequelize connects to the database and checks the table structures.  
If the models do not match the tables in the database, they are automatically synchronized.

You can change this behavior by modifying the configuration in the `.env` file:

- **`MODE`**: Set to `production` for a production environment.

## Running the Backend

Ensure that the environment variables are correctly set in your `.env` file.

Start the backend:

```bash
  npm run start 
```
```bash
  #or
  npm run start:dev 
```

- [Nest.js Documentation](https://docs.nestjs.com/) - learn about Nest.js features and API.
- [Documentation](http://localhost:3001/docs#/) - learn about this backend API and endpoints.

If you want to add an administrator, run the following command:
bash

```bash
  npm run seed:admin
```
