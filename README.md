# The Lounge - Client

Welcome to The Lounge, a real-time chat application that lets you create sessions instantly to chat with friends. Share the link, jump into conversations, and enjoy private chats that disappear when the session ends.

## Table of Contents
- [The Lounge - Client](#the-lounge---client)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Live Application](#live-application)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Firebase Setup](#firebase-setup)
    - [Environment Configuration](#environment-configuration)
    - [Installation for Local Development](#installation-for-local-development)
    - [Running the Client Locally](#running-the-client-locally)
    - [Server Setup](#server-setup)
  - [License](#license)
  - [Contact](#contact)

## Features

- **Instant Chat Rooms:** Create a chat session in seconds and share the link for friends to join.
- **Privacy Focused:** Messages are not saved and are automatically deleted when all users leave the session.
- **Real-Time Interaction:** Experience live chatting with the integration of Socket.IO for seamless communication.
- **Upcoming:** Account creation for managing friends and initiating chats easily.

## Technology Stack

- Next.js
- TypeScript
- Node.js
- Firebase
- Socket.IO

## Live Application

Access the live version of The Lounge at [this link](https://the-lounge-5a74a8547b78.herokuapp.com/).

## Getting Started

### Prerequisites

- Node.js
- npm or Yarn
- A Firebase account

### Firebase Setup

1. Go to the Firebase Console (https://console.firebase.google.com/) and create a new project.
2. Set up Authentication: Go to the Authentication section and enable the sign-in methods you want to use (Google, Email/Password, Phone, etc.).
3. Set up Firestore and Realtime Database: Go to the Firestore section to create a new Firestore database. Go to the Realtime Database section to create a new database. 
4. Navigate to Project settings in the Firebase console and find your app's Firebase SDK snippet. Copy the config object to the `firebaseConfig.ts` file. 
5. Obtain the Realtime Database URL, Google Client ID, and Google Secret.

### Environment Configuration

Create a `.env.local` file in the root of your project and include the following variables, prefixed with `NEXT_PUBLIC_` as required by Next.js:

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_ANON_TOKEN=your_anon_token
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_SECRET=your_google_secret
NEXT_PUBLIC_DEPLOY_URL=http://localhost:8080

### Installation for Local Development

1. Clone the repository:```bash git clone git@github.com:c1008h/The-Lounge.git```
2. Navigate into the directory: ```cd The-Loung```
3. Install the dependencies: ```npm install``` or if you are using Yarn: ```yarn install```

### Running the Client Locally

Start the development server: ```npm run dev``` or with Yarn: ```yarn dev```
Open your browser and navigate to `http://localhost:3000` to view the client application.

### Server Setup

After setting up the client, you need to set up the server to handle backend operations.

1. Clone the server repository:```git clone git@github.com:c1008h/the-lounge-backend.git```
2. Follow the setup instructions detailed in the server README at: <https://github.com/c1008h/the-lounge-backend/blob/main/README.md>

## License

This project is licensed under the MIT License.

## Contact

Feel free to reach out if you have any questions.

>Github: [c1008h](https://github.com/c1008h) <br>
>Email: [hongchris97@gmail.com](mailto:hongchris97@gmail.com)

Make sure to replace placeholder values (like `your_firebase_api_key`, `your_google_client_id`, etc.) with the actual values from your Firebase and Google setup. This README gives a comprehensive guide to setting up the client side of your application, including environmental variables and linking to the server setup instructions.
