# Task Manager

A simple task manager built with Next.js, MongoDB, and NextAuth.

## Features

- Google sign-in with NextAuth
- Create, view, edit, and delete tasks
- Task priorities, due dates, and completion status
- Search and filter tasks from the task list

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add a `.env` file with:

```bash
MONGODB_URI
GOOGLE_ID
GOOGLE_CLIENT_SECRET
```

3. Start the app:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - run the production build
- `npm run lint` - run lint checks
- `npm run test` - run the test suite

## Notes

- You need a MongoDB database and Google OAuth credentials for sign-in to work.
- Task data is stored in MongoDB and is tied to the signed-in user.
