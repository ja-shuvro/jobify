# Jobify

Jobify is a job portal application that connects employers with potential employees. It allows companies to post job opportunities and users to search and apply for jobs. The project is built with a **backend** supporting user authentication, job posting, and search functionality, designed to provide an easy-to-use platform for employers and job seekers.

---

## Features

- **User Authentication:**
  - User and company sign-up and login functionality.
  - JWT-based authentication for secure user sessions.
  - Role-based access control for users and companies.

- **Job Posting:**
  - Companies can create, manage, and update job postings.
  - Job details include title, description, location, salary, and job type.

- **Job Search:**
  - Job seekers can search for job postings based on filters such as job title, location, company, salary range, and job type.
  - Pagination for displaying job results.

- **Backend Services:**
  - RESTful API for managing users, job data, and authentication.
  - Data storage using **MongoDB** for users and job listings.

---

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime used to build the backend.
- **Express.js**: Web framework for building RESTful APIs.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **MongoDB**: NoSQL database for storing user profiles and job listings.
- **Bcryptjs**: Library for securely hashing and verifying user passwords.
- **Helmet**: Middleware for securing HTTP headers and protecting the app from common security vulnerabilities.
- **Mongoose**: Object Data Modeling (ODM) for MongoDB to define and manage schemas.

---

## Installation

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (local or hosted)

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ja-shuvro/jobify.git
   cd jobify/backend
   ```

2. **Install Backend Dependencies**:

   In the backend directory, install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root of the backend folder and add the following variables:

   ```env
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/jobify
      JWT_SECRET=your_jwt_secret_here
      JWT_EXPIRY=1d
      CLOUDINARY_CLOUD_NAME=your_cloud_name_here
      CLOUDINARY_API_KEY=your_cloudinary_api_key_here
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
      OPENAI_API_KEY=your_openai_api_key_here

   ```

4. **Run the Backend**:

   Start the backend server:

   ```bash
   npm run dev
   ```

   The backend server will now be running on `http://localhost:5000`.

---

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user or company.
  - Request body: `{ "email": "user@example.com", "password": "password123", "role": "super-admin|admin|user" }`
  
- **POST /api/auth/login**: Login an existing user or company and receive a JWT token.
  - Request body: `{ "email": "user@example.com", "password": "password123" }`

### Jobs

- **GET /api/jobs**: Get a list of all job postings with pagination.
  - Query parameters: `page`, `limit`, `title`, `location`, `company`, `jobType`
  - Example: `/api/jobs?page=1&limit=10&title=developer&location=remote`

- **POST /api/jobs**: Create a new job posting (company only).
  - Request body: `{ "title": "Job Title", "description": "Job Description", "company": "Company ID", "location": "Location", "salary": "100000", "jobType": "full-time" }`

- **GET /api/jobs/:id**: Get details of a specific job posting by ID.
  - Example: `/api/jobs/123456`

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

- **Node.js** - JavaScript runtime for building the backend.
- **Express.js** - Web framework for building APIs.
- **JWT** - Authentication solution for secure sessions.
- **MongoDB** - NoSQL database for storing data.
- **Bcryptjs** - Secure password hashing and verification.
- **Mongoose** - Object Data Modeling (ODM) for MongoDB schemas.

---

### Updates:

- Added role-based user authentication with JWT (users and companies).
- API now supports pagination for job listings.

---

Feel free to modify this further based on your project setup and any additional features you want to highlight!
