# Heads-Up Hold'em

## Description:

<strong>Heads-Up Hold'em</strong> is a full-stack poker application built with the MERN-stack, where a user can create an account and play $10/$20 Heads-Up No-Limit Texas Hold'em against an opponent. Each player starts with $10k in play chips every game.

The Frontend is a React application while the server was built with a <a href="https://github.com/ryanmfoley/headsup-holdem-backend">Node/Express backend</a>. In-game logic-related communications & chat is handled via web sockets / Socket.io.

You can view the app <a href="https://headsup-holdem.netlify.app/">here</a>.

## Technologies Used

### Backend:

- NodeJS & Express
- MongoDB is used as the database & Mongoose as ORM
- Authentication is implemented with JSON Web Tokens
- Passwords are encrypted with bcrypt
- The client-server communication for the game-logic is implemented with Socket.io

### Frontend:

- JavaScript
- React
- Material-UI
- Socket.io

### Features

- User can register & login
- Passwords are encrypted and stored in a DB
- Authentication is handled via JWT-webtokens
- Communication with the Backend is handled with Axios (REST-API) & Socket.io (Game logic)
