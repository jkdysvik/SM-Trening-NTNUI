# SM Training NTNUI Rowing

This is a web application for NTNUI Rowing to request training time slots based on water level predictions. The app allows users to book available slots for their team, while admins can review, approve, or reject requests.

## Features

- User authentication with Firebase
- Request training slots within allowed time periods
- Admin panel to approve or reject requests
- Fetches real-time water level data from Kartverket Tide API

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/SM-Treningsforesporsel.git
cd SM-Treningsforesporsel
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Firebase
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email & Password Sign-In).
3. Create a **Firestore Database** with collections:
   - `users` → Stores user information (team, email, admin status).
   - `requests` → Stores training requests (date, time, approval status).
4. Copy Firebase config into `.env`:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```
5. Restart the server after saving the `.env` file.

### 4. Start the Development Server
```sh
npm start
```
The app will run at `http://localhost:3000`.

## Deployment

### Deploy to Vercel
```sh
npm install -g vercel
vercel login
vercel
```

### Deploy to Firebase Hosting
```sh
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

## Tech Stack

- **Frontend**: React.js, React Router, CSS Modules
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Data Fetching**: Kartverket Tide API
- **Deployment**: Vercel / Firebase Hosting

## License
This project is licensed under the MIT License.
