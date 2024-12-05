# Jobify

Jobify is a job portal application that allows companies to post job opportunities and users to search and apply for jobs. The project is built with a **backend** that supports user authentication, job posting, and job search functionality. It is designed to provide an easy-to-use platform for employers and job seekers.

---

## Features

- **User Authentication:**
  - Sign-up and login functionality for users and companies.
  - JWT-based authentication for secure user sessions.
  
- **Job Posting:**
  - Companies can create and manage job postings.
  - Job details such as title, description, company name, and job type.

- **Job Search:**
  - Job seekers can search for job postings based on different filters (e.g., job title, location, company, etc.).

- **Backend Services:**
  - RESTful API for managing user and job data.
  - Data storage using **MongoDB** for users and **MySQL** for job listings.
  
---

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime is used to build the backend.
- **Express.js**: Web framework for building APIs.
- **JWT**: JSON Web Tokens for user authentication.
- **MongoDB**: Database for user-related data (e.g., profile, authentication).
- **Redis**: Caching service for fast access to frequently used data.
- **Bcryptjs**: Library for securely hashing user passwords.
- **Helmet**: Middleware for setting security-related HTTP headers.

---

## Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local or hosted)
- **MySQL** (local or hosted)
- **Redis** (local or hosted)

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/jobify.git
   cd jobify/backend
  

2. **Install Backend Dependencies**:

   In the backend directory, install the necessary dependencies:

   ```bash
   npm install


3. **Set Up Environment Variables**:

   Create a `.env` file in the root of the backend folder and add the following variables:

   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=1d
   MONGO_URI=mongodb://localhost:27017/jobify
   MYSQL_URI=mysql://user:password@localhost:3306/jobify
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

4. **Run the Backend**:

   Start the backend server:

   ```bash
   npm run dev
   ```

   Your server will be running on `http://localhost:5000`.

---

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login an existing user.

### Jobs

- **GET /api/jobs**: Get a list of all job postings.
- **POST /api/jobs**: Create a new job posting (company only).
- **GET /api/jobs/:id**: Get details of a specific job posting.

---

## Contributing

We welcome contributions to the Jobify project! If you want to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- **Node.js** - JavaScript runtime.
- **Express.js** - Web framework for building APIs.
- **JWT** - Authentication solution.
- **MongoDB** & **MySQL** - Databases for storing user and job data.
- **Redis** - Caching mechanism.


---

### Explanation:

- **Introduction**: Provides an overview of the project and what it does.
- **Features**: Lists the key features of the application.
- **Tech Stack**: Describes the technologies used for both backend and database.
- **Installation**: Provides detailed steps for setting up the project on your local machine.
- **API Endpoints**: Lists the key API endpoints for user authentication and job-related actions.
- **Contributing**: Instructions for contributing to the project.
- **License**: The project is open-source and follows the MIT License.
- **Acknowledgements**: Mentions the technologies used in the project.

---

You can adjust it according to your project setup and personal preferences!
