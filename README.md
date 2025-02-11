This is a simple To-Do List API built with Node.js, Express, MySQL, and JWT authentication.

## Features
- User authentication with JWT.
- CRUD operations for To-Do Lists.
- CRUD operations for Tasks within a To-Do List.
- Ownership verification for secure operations.
- Pagination for retrieving To-Do Lists.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/todo-api.git
   cd todo-api
Install dependencies:

```sh
npm install
```
Set up the database:

Create a MySQL database.
Configure the database connection in .env file

migrate the database

```sh
npx knex migrate:latest
```

and seed the demo data
```sh
npx knex seed:run
```
Start the server:

```sh
npm start
```
or for development mode:

```sh
npm run dev
```

API Endpoints

Authentication
POST /auth/register - Register a new user.
POST /auth/login - Login and receive a JWT token.

To-Do Lists
POST /todos - Create a new to-do list (Requires authentication).
GET /todos - Get all to-do lists for the logged-in user (Requires authentication).
GET /todos/:id - Get a specific to-do list (Requires authentication & ownership).
PUT /todos/:id - Update a to-do list (Requires authentication & ownership).
DELETE /todos/:id - Delete a to-do list (Requires authentication & ownership).

Tasks
POST /todos/:id/tasks - Add a task to a to-do list (Requires authentication & ownership).
GET /todos/:id/tasks - Get all tasks for a to-do list (Requires authentication & ownership).
PUT /tasks/:id - Update a task (Requires authentication & ownership).
DELETE /tasks/:id - Delete a task (Requires authentication & ownership).

