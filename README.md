# Dissertation Registration Application

A web application designed to facilitate the dissertation registration process for students and professors. The platform allows users to manage dissertation requests in an efficient and user-friendly manner, supporting both desktop and mobile devices as a Single Page Application (SPA).

---

## Objective

The goal of this application is to streamline the dissertation registration process by providing an intuitive and functional interface for students and professors to interact with. The platform ensures that all steps, from initial requests to final approvals, are handled efficiently.

---

## Features

### General
- Single Page Application (SPA) accessible via desktop, mobile, or tablet browsers.
- Secure user authentication and role-based access control (students and professors).

### For Students
- Submit preliminary requests to professors.
- Track the status of submitted requests.
- Upload signed requests after approval.
- View feedback or file uploads from professors.
- Submit new requests if the previous one is rejected.

### For Professors
- Create and manage registration sessions with no overlap between sessions.
- View and manage requests submitted by students.
- Approve or reject student requests with a justification.
- Upload files in response to approved requests.

### Business Rules
- A student can submit requests to multiple professors, but only one approval is allowed.
- Once approved by a professor, the student cannot receive approvals from others.
- Rejected requests allow students to submit new requests.

---

## Technologies Used

### Frontend
- **React.js**: Component-based UI development.
- **React Router**: SPA navigation.

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for handling API endpoints.
- **MongoDB**: NoSQL database for storing users, sessions, and requests.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Secure user authentication.
- **multer**: File uploads for student and professor documents.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v16+)
- MongoDB
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AndreiHammer/dissertation-registration-app.git
   cd dissertation-registration-app
   ```

2. **Start the backend**:
   - Navigate to the backend and install dependencies
   ```bash
   cd server
   npm install
   ```
   - Create a .env file in the backend directory and create the following variables:
   ```bash
   PORT=8080
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   ```
   -Start the server
   ```bash
   npm start
   ```
2. **Start the frontend**:
   - Navigate to the frontend and install dependencies
   ```bash
   cd ../client
   npm install
   ```
   -Start the client
   ```bash
   npm run dev
   ```
## Future Enhancements
- **User Interface**: Enhance the UI for improved accessibility and mobile responsiveness.
- **Real-Time Updates**: Implement real-time notifications for request status changes.
- **Role-Based Enhancements**: Further refine role-based permissions, allowing customized user roles (e.g., department heads).
- **File Versioning**: Enable file versioning for documents uploaded by professors or students.
- **Automated Reminders**: Integrate email or SMS notifications for important deadlines and status updates.
- **Student Analytics**: Add analytics for students to track their submission progress and feedback history.

## Contributions
Feel free to fork the repository and contribute to the project. Contributions in the form of pull requests, bug fixes, and improvements are always welcome.


