User Management System

A full-stack User Management System built with Spring Boot (backend) and React Native Expo (frontend).
The application provides secure authentication, OTP-based password recovery, and complete user management functionality.

This project demonstrates real-world full-stack development practices and is suitable for learning and interview preparation.

Features
Authentication

Admin registration

Admin login

Forgot password with OTP

Reset password with OTP validation

User Management

Add user

View user list

Delete user

View admin profile

Security & Validation

Password encryption using BCrypt

OTP expiry validation

Name, email, and password validation

Frontend and backend validation

Technology Stack
Backend

Java

Spring Boot

Spring Data JPA

MySQL

Maven

BCrypt Password Encoder

Frontend

React Native

Expo

TypeScript

AsyncStorage

Fetch API

Project Structure
user-management
│
├── Backend
│   └── user-management
│
├── Frontend
│   └── expo
│       └── UserManagementApp

Backend Setup

Navigate to backend project:

cd Backend/user-management


Configure database credentials in:

application.properties


Run the backend:

mvn spring-boot:run


Backend will start at:

http://localhost:8082

Frontend Setup

Navigate to frontend project:

cd Frontend/expo/UserManagementApp


Install dependencies:

npm install


Start the application:

npx expo start

API Endpoints
Method	Endpoint	Description
POST	/api/register	Register admin
POST	/api/login	Login admin
POST	/api/forgot-password	Send OTP
POST	/api/reset-password	Reset password
POST	/api/users/add	Add user
GET	/api/users/list/{adminId}	List users
DELETE	/api/users/delete/{id}	Delete user
Validation Rules

Name: Alphabets only, maximum 50 characters

Email: Valid email format

Password: Strong password required

OTP: Expires after defined time

All inputs validated on frontend and backend

Highlights

Clean layered architecture (Controller, Service, Repository)

Secure password handling

OTP based recovery flow

Professional GitHub structure

Frontend-backend integration

User-friendly UI

Screens Implemented

Login

Register

Forgot Password

Reset Password

User List

Add User

Profile

Developer

Purvesh Sawalakhe

GitHub:
https://github.com/Purvesh8762
