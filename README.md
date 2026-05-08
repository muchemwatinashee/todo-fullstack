Full-Stack To-Do Application with Secure Authentication
Built with FastAPI (Python) and React (TypeScript)

Project Overview
I developed this project to demonstrate a complete, secure, and modern authentication flow. Beyond a simple to-do list, this application serves as a foundation for any system requiring private user data and secure access control.

Technical Stack
Backend: FastAPI (Python) - Chosen for its high performance and automatic Swagger UI documentation.

Frontend: React with TypeScript - Utilized to ensure type safety and robust compile-time error checking.

Security: JWT (JSON Web Tokens) for stateless authentication and Bcrypt for industry-standard password hashing.

Core Features
1. Secure Authentication Flow
I implemented a complete Registration-to-Access loop:

Password Hashing: User credentials are never stored in plain text. They are salted and hashed using Bcrypt before being saved to the database.

Token-based Access: Upon successful login, the system issues a JWT. This token is required to unlock protected areas of the application.

2. Protected Routing
Using React, I established logic gates for the frontend. If a user attempts to access the dashboard without a valid authentication token, the application automatically redirects them to the Login page.

3. Audit Logging
To meet audit requirements, the backend tracks major events. Actions such as user registration and login attempts are recorded in an app.log file for monitoring and security purposes.

Technical Challenges Overcome
CORS Configuration: I configured the backend to securely communicate with the frontend, resolving cross-origin blocks that occur when different local servers attempt to exchange data.

Git Repository Management: I diagnosed and resolved an embedded repository conflict. By manually cleaning the Git history and removing hidden internal configurations, I ensured both the frontend and backend were correctly tracked in a single unified repository.

Installation and Setup
Backend
Navigate to the /backend directory.

Install dependencies: pip install -r requirements.txt.

Run the server: uvicorn main:app --reload.

Frontend
Navigate to the /frontend directory.

Install packages: npm install.

Start the application: npm start.

Final Reflections
This project provided a deep dive into the integration of a Python-based backend with a strictly typed React frontend. It allowed me to practicalize concepts of data security, API design, and version control management.
<img width="668" height="788" alt="image" src="https://github.com/user-attachments/assets/20699a3f-563c-4e2a-9e4c-4aab2409cb3c" />

<img width="50" height="60" alt="image" src="https://github.com/user-attachments/assets/34a4d1e8-9676-42dc-ba2c-dd5f324833f3" />

<img width="913" height="331" alt="image" src="https://github.com/user-attachments/assets/a2f3733d-0939-4e9b-bd00-49ae4faf7aad" />













