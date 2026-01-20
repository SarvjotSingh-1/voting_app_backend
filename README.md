# voting_app_backend
This is the **backend of a Voting App** built with **Node.js, Express, and MongoDB**.  
It provides APIs for **user authentication, candidate management, and voting**.

## Features
- User sign up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin cannot vote

## Technologies Used
- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JSON Web Tokens (JWT) for authentication  
- bcrypt for password hashing  

## Installation
1.Clone the repository:
git clone https://github.com/SarvjotSingh-1/voting_app_backend.git

# API Endpoints

## Authentication

### Sign Up
- **POST** `/signup` – Sign up a new user

### Login
- **POST** `/login` – Login an existing user

## User Profile

- **GET** `/profile` – Get logged-in user profile (**requires auth**)  
- **PUT** `/profile/password` – Update logged-in user password (**requires auth**)  

## Candidate Routes

- **POST** `/candidates/` – Add a new candidate (**Admin only**)  
- **PUT** `/candidates/:CandidateID` – Update candidate by ID (**Admin only**)  
- **DELETE** `/candidates/:CandidateID` – Delete candidate by ID (**Admin only**)  
- **POST** `/candidates/vote/:candidateID` – Vote for a candidate (**User only**)  
- **GET** `/candidates/vote/count` – Get vote counts for all candidates  
- **GET** `/candidates/candidate` – Get all candidates (name & party)  



