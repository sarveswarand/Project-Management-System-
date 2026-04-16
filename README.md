#  Project Management System (Backend)

##  Overview

This is a backend-only Project Management System built using NestJS. It provides APIs to manage users, projects, and tasks efficiently. The system supports CRUD operations, structured modular architecture, and database integration using TypeORM with MySQL. It is designed to demonstrate scalable backend design and clean architecture principles.

---

##  Tech Stack

* NestJS
* MySQL

---

##  Project Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd project_management_system
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=database_name
```

---

### 4. Run the application

#### 🔹 Development mode (recommended)

```bash
npm run start:dev
```

#### 🔹 Debug mode

```bash
npm run start:debug
```

#### 🔹 Production mode

```bash
npm run build
npm run start:prod
```

