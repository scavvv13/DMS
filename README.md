MIAA Document Management System (Capstone Project)

This repository contains the Document Management System (DMS) for MIAA, built using the MERN stack (MongoDB, Express, React, Node.js). The project aims to create an efficient and user-friendly system for managing documents, utilizing modern web development technologies and a clean, responsive design.

Features

User Authentication & Role-Based Access Control: Implemented with Auth0 to handle user login, registration, and role-based access control (RBAC).
Document Upload & Management: Users can upload, categorize, and manage documents securely.
Real-Time Updates: React hooks and state management ensure the UI updates in real-time.
Responsive Design: Built with Tailwind CSS and DaisyUI for a fully responsive, mobile-friendly interface.
API Integration: Powered by a custom Node.js & Express backend, connected to MongoDB for secure document storage.

Tech Stack

Frontend: React (with Vite), Tailwind CSS, DaisyUI
Backend: Node.js, Express.js
Database: MongoDB (using Mongoose for data modeling)
Authentication: Auth0 with RBAC (Role-Based Access Control)
State Management: React Context API
Styling: Tailwind CSS, DaisyUI
File Storage: MongoDB GridFS or a third-party storage solution like AWS S3 (optional)

Installation -----------------------------------------------------------

Clone the repository:

bash-

git clone https://github.com/scavvv13/DMS.git
Navigate to the project directory:

bash-

cd miaa-dms
Install dependencies:

bash-

# Install frontend dependencies

cd client
npm install

# Install backend dependencies

cd ../server
npm install

Set up environment variables. Create a .env file in the root of the server directory with the following values:

env-

MONGO_URI=<Your MongoDB URI>
AUTH0_DOMAIN=<Your Auth0 Domain>
AUTH0_CLIENT_ID=<Your Auth0 Client ID>
AUTH0_CLIENT_SECRET=<Your Auth0 Client Secret>

Start the development servers:

bash-

# Run backend

cd server
npm run dev

# Run frontend

cd ../client
npm run dev

Usage:
Document Upload: After logging in, users with the correct permissions can upload documents, which are securely stored and categorized.
Document Management: Users can view, edit, and delete their documents based on role permissions.
Admin Features: Admins have access to manage user roles, and perform administrative tasks related to document access and permissions.
Folder Structure
bash
Copy code
├── client # Frontend (React with Vite)
│ ├── public # Static assets
│ ├── src # React components, contexts, and hooks
│ └── tailwind.config.js # Tailwind CSS configuration
├── server # Backend (Node.js, Express)
│ ├── models # Mongoose models
│ ├── routes # API routes
│ ├── controllers # Route handlers
│ ├── middleware # Custom middleware
│ └── config # Auth0 and MongoDB configuration
└── README.md # Project documentation
Contributing
Feel free to fork this repository and submit pull requests for any enhancements or bug fixes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For more information, reach out to me at:
Email: scave1013@gmail.com
GitHub: @scavvv13
