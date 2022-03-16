# Movie Review

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 16.14.0(and above)
- Install [Git](https://nodejs.org/en/) version 2.29.2(and above)
- Install [MongoDB](https://nodejs.org/en/) version 2.29.2(and above)
- Install VS Code and Thunder Client extension or Postman for api testing.


## Installation

- Clone the repository
```
git clone "https://github.com/Prathap-P/movies-review-backend.git" movies-review-backend
```
- Install dependencies
```
cd movies-review-backend
npm install
```
- Create .env file and insert following
```
SECRET=<random string>
MONGO_URI=<URI of locally installed mongodb> //optional
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:9000`

## Description

This project is an API for movie review system. This is not a full stack project, so we need tools like Postman or Thunder Client(VS Code extension) to test the api. Please follow the installing instructions, if you need to implement the api locally or you can also use the link of the hosted site to test the api remotely.

There are 2 types of users, Admin and User. Admin can add, delete and update movies. New users can register and get logged in. Logged in users can add, delete and update their comments or reviews on a movie. This project uses bcrypt library for hashing passwords. Also uses JWT as token based authentication for authenticating users and also for maintaining session for users.

## End Points

The api end points of the app :

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **/**                  | This is the home page of the api. It lists all movies in the db |
| **/movie/:id**         | This gives the details of the movie with the specific movie id. It also lists the comments users posted about the movie. |
| **/auth/register - POST**      | Used to register a new user |
| **/auth/login - POST**        | Used to login a registered user |
| **/add_movie - POST**      | Adds a new movie to the database (Admins can only do this) |
| **/movie/&lt;id> - PUT**      | Updates the details of a movie (Admins can only do this) |
| **/movie/&lt;id> - DELETE**   | Deletes a movie from the database (Admins can only do this) |
| **/movie/&lt;id>/add_comment - POST**      | Posts a comment of a user for a specific movie (Registered Users can only do this) |
| **/movie/&lt;movieId>/&lt;commentId> - DELETE**    | Deletes a particular comment of a user for a movie (Users who post the comment can only delete it) |
| **/movie/&lt;movieId>/&lt;commentId> - PUT**    | Updates a particular comment of a user for a movie (Users who post the comment can only delete it) |
