 Project Management System (Backend)
 Overview

This is a backend-only Project Management System built using NestJS. It provides APIs to manage users, projects, and tasks efficiently. The system supports CRUD operations, structured modular architecture, and database integration using TypeORM with MySQL. It is designed to demonstrate scalable backend design and clean architecture principles.

Tech Stack
NestJS
MySQL

📂 Project Setup
1. Clone the repository
git clone <your-repo-url>
cd project_management_system
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the root directory and add:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=project_management
4. Run the application
🔹 Development mode (recommended)
npm run start:dev
🔹 Debug mode
npm run start:debug
🔹 Production mode
npm run build
npm run start:prod
