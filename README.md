# Dissertation Registration App

## Overview

This web application allows students to register their dissertation papers with coordinating professors. It is built using a Single Page Application (SPA) architecture and can be accessed from any device, including desktops, mobiles, or tablets.

## Features

### User Types
- **Student**: Can request to be coordinated by a professor and upload the necessary files.
- **Professor**: Can approve or reject student requests, set registration sessions, and upload response files.

### Key Functionality

- **Registration Sessions**: Professors can create registration sessions, which cannot overlap in time.
- **Request System**:
  - Students can make preliminary requests to professors during a registration session.
  - Professors can approve or reject requests within a pre-established limit (based on the number of students they can coordinate).
  - A student can make multiple requests to different professors, but once approved by one professor, they cannot be approved by another.
- **File Uploads**:
  - After the request is approved by a professor, the student can upload the signed dissertation coordination request.
  - Professors can upload a response file or reject the request, prompting the student to upload a new file.
  
## How to Run

### Prerequisites

- Node.js
- MongoDB (or any other database of your choice)
- Git

### Installation Steps

1. Clone this repository:
  git clone https://github.com/stefanoctavian85/dissertation-registration-app.git
2. Navigate to the project folder:
   cd dissertation-registration-app
3. Install the dependencies:
   npm install
4. Set up your environment variables for PORT, MONGO_URI and SECRET
5. Start the project!
   npm run dev for client and npm start for server

## Technologies Used
1. Frontend: React (SPA architecture)
2. Backend: Node.js
3. Database: MongoDB (or other, based on configuration)
4. Authentication: JWT (JSON Web Tokens) for secure login sessions
