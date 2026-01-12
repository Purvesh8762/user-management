User Management System

This is a full-stack User Management System built using Spring Boot for backend and React Native Expo for frontend.
The project is created mainly for learning, practice, and interview preparation.

It allows an admin to manage users with secure authentication and password recovery using OTP.

🌟 What this project does

An admin can:

Register

Login

Reset password using OTP

Add users

View user list

Delete users

View profile

The project focuses on clean UI, validation, and secure backend logic.

🛠 Technologies Used
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

📂 Project Structure
user-management
│
├── Backend
│   └── user-management
│
├── Frontend
│   └── expo
│       └── UserManagementApp

▶ How to Run Backend

Open backend folder:

cd Backend/user-management


Configure database in application.properties

Run:

mvn spring-boot:run


Backend will run on:

http://localhost:8082

▶ How to Run Frontend

Open frontend folder:

cd Frontend/expo/UserManagementApp


Install dependencies:

npm install


Start app:

npx expo start

🔗 API Endpoints
Method	API	Purpose
POST	/api/register	Register admin
POST	/api/login	Login admin
POST	/api/forgot-password	Send OTP
POST	/api/reset-password	Reset password
POST	/api/users/add	Add user
GET	/api/users/list/{adminId}	Get user list
DELETE	/api/users/delete/{id}	Delete user
✅ Validations

Name → only alphabets, max 50 characters

Email → valid email format

Password → strong password rule

OTP → expiry validation

Frontend + backend both validate inputs

🧠 Why this project is good for interview

This project demonstrates:

Authentication flow

OTP based password reset

CRUD operations

Secure password encryption

Frontend backend integration

Clean architecture

GitHub best practices

📸 Screens in App

Login Screen

Register Screen

Forgot Password Screen

Reset Password Screen

User List Screen

Add User Screen

Profile Screen

👨‍💻 Developer

Purvesh Sawalakhe

GitHub:
👉 https://github.com/Purvesh8762
