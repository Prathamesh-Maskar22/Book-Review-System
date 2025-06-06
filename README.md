# Book Review API

A RESTful API for managing books and reviews with JWT-based authentication, built using Node.js, Express, and MongoDB.

## Features
- User authentication (signup/login) with JWT
- CRUD operations for books (authenticated users can add books)
- Retrieve books with pagination and filters (author, genre)
- Submit, update, and delete reviews (one per user per book)
- Search books by title or author (case-insensitive)

## Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing

## Database Schema
- **User**: `{ username: String, email: String, password: String }`
- **Book**: `{ title: String, author: String, genre: String, createdBy: UserId }`
- **Review**: `{ book: BookId, user: UserId, rating: Number (1-5), comment: String, createdAt: Date }`

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd book-review-api
   npm run dev OR node index.js
