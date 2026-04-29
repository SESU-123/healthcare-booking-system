# Online Appointment Booking System

A complete MERN stack application for healthcare clinics featuring a beautiful, animated UI using React, Tailwind CSS, and Framer Motion.

## Features
- **Authentication**: JWT-based login and registration
- **Role-based Access**: Patient, Doctor, Admin panels
- **Appointments**: Real-time booking, cancellation, and updates
- **Dashboard**: Animated statistics and charts
- **Security**: Helmet.js, Rate Limiting, bcrypt password hashing

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Installation & Running Locally

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Configure Environment Variables**
   Rename `server/.env.example` to `server/.env` and update your MongoDB URI.

4. **Run the Application**
   Open two terminals:

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

## API Endpoints Summary
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/doctors` - Get all doctors
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments

## Packaging Instruction
To zip this project for distribution:
1. Ensure you are in the root directory.
2. Run `Compress-Archive -Path client, server, README.md -DestinationPath healthcare-booking-system.zip` in PowerShell.
