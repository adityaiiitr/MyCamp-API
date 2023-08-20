# MyCamp API 🚀

Welcome to the MyCamp API documentation! This API allows you to manage bootcamps, courses, user authentication, users, and reviews for educational purposes.

## Routes 🛤️

### Bootcamps

- **GET** `/api/v1/bootcamps`: Get all bootcamps.
- **GET** `/api/v1/bootcamps/:id`: Get a single bootcamp by ID.
- **POST** `/api/v1/bootcamps`: Create a new bootcamp.
- **PUT** `/api/v1/bootcamps/:id`: Update a bootcamp.
- **DELETE** `/api/v1/bootcamps/:id`: Delete a bootcamp.
- **GET** `/api/v1/bootcamps/radius/:zipcode/:distance`: Get bootcamps within a certain radius.

### Courses

- **GET** `/api/v1/courses`: Get all courses.
- **GET** `/api/v1/courses/:id`: Get a single course by ID.
- **POST** `/api/v1/bootcamps/:bootcampId/courses`: Create a course for a specific bootcamp.
- **PUT** `/api/v1/courses/:id`: Update a course.
- **DELETE** `/api/v1/courses/:id`: Delete a course.

### Authentication

- **POST** `/api/v1/auth/register`: Register a new user.
- **POST** `/api/v1/auth/login`: Login a user.
- **GET** `/api/v1/auth/me`: Get logged-in user's details.
- **POST** `/api/v1/auth/forgotpassword`: Request to reset password.
- **PUT** `/api/v1/auth/resetpassword/:resetToken`: Reset user's password.
- **PUT** `/api/v1/auth/updatedetails`: Update user's details.
- **PUT** `/api/v1/auth/updatepassword`: Update user's password.
- **GET** `/api/v1/auth/logout`: Logout user.

### Users

- **GET** `/api/v1/users`: Get all users.
- **GET** `/api/v1/users/:id`: Get a single user by ID.
- **POST** `/api/v1/users`: Create a new user.
- **PUT** `/api/v1/users/:id`: Update a user.
- **DELETE** `/api/v1/users/:id`: Delete a user.

### Reviews

- **GET** `/api/v1/reviews`: Get all reviews.
- **GET** `/api/v1/reviews/:id`: Get a single review by ID.
- **GET** `/api/v1/bootcamps/:bootcampId/reviews`: Get reviews for a specific bootcamp.
- **POST** `/api/v1/bootcamps/:bootcampId/reviews`: Add a review for a bootcamp.
- **PUT** `/api/v1/reviews/:id`: Update a review.
- **DELETE** `/api/v1/reviews/:id`: Delete a review.

## Technologies Used 💻

- Node.js
- Express.js
- MongoDB
- Authentication with JWT

## Getting Started 🏁

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your environment variables.
4. Run the server using `npm run dev`.

## Contribute 🤝

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to create a pull request or open an issue.

---


Feel free to explore and interact with the [MyCamp API](https://documenter.getpostman.com/view/26380400/2s9Y5SW61m) using the provided routes. If you have any questions, feel free to reach out! Happy coding! 🎉
