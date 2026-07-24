# COSC Club Event Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing university club events, users, and club registry. Built as a Software Engineering final project.

## Description

The COSC Club Event Management System provides role-based access control for three user types: **Admin**, **Club Manager**, and **Member**. Admins can manage user roles and register new clubs. Club Managers and Members have dedicated dashboards for future event and membership features.

## Technologies Used

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **bcryptjs** – Password hashing
- **jsonwebtoken** – JWT authentication
- **dotenv** – Environment variables
- **cors** – Cross-origin resource sharing
- **express-validator** – Request validation

### Frontend
- **React.js** – UI library
- **React Router DOM** – Client-side routing
- **Axios** – HTTP client
- **React Bootstrap** – UI components
- **Bootstrap 5** – CSS framework

## Features Implemented

1. **User Authentication** – JWT-based login/logout with role-based access (Admin, Club Manager, Member)
2. **Admin User Management** – View all users and change user roles via dropdown
3. **Club Registry** – Admin creates clubs with unique name validation and views all registered clubs

## Project Structure

```
cosc-club-management/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/seed.js
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017

## Setup Instructions

### 1. Clone the repository

```bash
cd cosc-club-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create or verify the `.env` file in the `backend` folder:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/cosc_club_db
JWT_SECRET=super_secret_key_change_this_in_production
```

### 3. Seed the Database

Make sure MongoDB is running, then seed test users:

```bash
npm run seed
```

### 4. Start the Backend Server

```bash
npm run dev
```

The API will be available at `http://localhost:5001`.

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The React app will open at `http://localhost:3000`.

## Default Login Credentials

| Role          | Email              | Password     |
|---------------|--------------------|--------------|
| Admin         | admin@test.com     | Admin123!    |
| Club Manager  | manager@test.com   | Manager123!  |
| Member        | member@test.com    | Member123!   |

## API Endpoints

| Method | Endpoint                  | Access        | Description              |
|--------|---------------------------|---------------|--------------------------|
| POST   | /api/auth/register        | Public        | Register a member account |
| POST   | /api/auth/login           | Public        | User login               |
| POST   | /api/auth/logout          | Authenticated | User logout              |
| GET    | /api/users                | Admin         | Get all users            |
| PUT    | /api/users/:id/role       | Admin         | Update user role         |
| POST   | /api/clubs                | Admin         | Create a new club        |
| GET    | /api/clubs                | Authenticated | Get all clubs            |

## Testing Each Functionality

### 1. User Authentication
- Go to `http://localhost:3000/login`
- Log in with each test account and confirm redirect to the correct dashboard
- Click **Logout** and confirm you are returned to the login page
- Try accessing `/admin/dashboard` without logging in — you should be redirected to login

### 2. Admin User Management
- Log in as `admin@test.com` / `Admin123!`
- In the **User Management** section, view the list of all users
- Change a user's role using the dropdown in the Actions column
- Confirm a success toast appears and the role is updated

### 3. Club Registry
- While logged in as admin, scroll to **Club Management**
- Fill in Club Name, Description, and Founding Date, then click **Create Club**
- Confirm the club appears in the **Registered Clubs** table
- Try creating a club with the same name — you should see a duplicate name error

### 4. Role-Based Access
- Log in as `manager@test.com` — you should see the Club Manager dashboard only
- Log in as `member@test.com` — you should see the Member dashboard only
- Neither role should be able to access the Admin dashboard

## Author

Individual Software Engineering Final Project – COSC3506
