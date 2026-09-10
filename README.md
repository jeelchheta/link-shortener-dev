# JP Link Shortener

A full-stack Link shortener web app built with React on the frontend and Express + MongoDB on the backend. It lets users shorten Links, track click analytics, manage link campaigns, and upgrade plans via Braintree payments.

## Overview

This project includes:

- Link shortening with optional custom short codes
- Redirect handling for shortened links
- Basic analytics and 14-day click trends
- QR code support for each short link
- Tags and expiration dates for links
- User authentication and password reset flow
- Subscription plans and billing integration with Braintree
- Dashboard with stats and link management

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email flows
- Braintree for subscription payments

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- React Router
- Bootstrap 5
- Recharts for analytics charts
- React Toastify for notifications

## Project Structure

```text
link-Shortener/
├── backend/
│   ├── BL/
│   ├── config/
│   ├── constant/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── templates/
│   ├── utils/
│   ├── types/
│   ├── index.ts
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── .env
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Features

### User Features
- Register and login
- Email OTP verification flow
- Password reset via email token
- Authenticated dashboard access
- Link listing, editing, and deletion
- Real-time short Link creation

### Link Features
- Preserve valid Link validation
- Generate short codes automatically or allow custom ones
- Link tags and expiration dates
- Click tracking with history data
- Redirect route for public short links

### Subscription Features
- Free plan with a limited number of links
- Paid plans through Braintree
- Client token generation
- Plan listing and checkout flow
- Subscription cancellation support

## Environment Variables

Create a root `.env` file before running the backend. Example:

```env
JWT_SECRET=your_jwt_secret
JWT_TIMEOUT=16h
MONGODB_URI=mongodb://localhost:27017/urlshortener
PORT=5000
RESET_TOKEN_EXPIRES_MIN=30
OTP_EXPIRATION_MIN=5
TOKEN_EXPIRATION_MIN=5
AppName=JP Link Shortner

MAIL_USER=your_email@gmail.com
MAIL_APP_PASSWORD=your_app_password

BRAINTREE_ENVIRONMENT=Sandbox
BRAINTREE_MERCHANTID=your_merchant_id
BRAINTREE_PUBLICKEY=your_public_key
BRAINTREE_PRIVATEKEY=your_private_key
```

## Installation

### 1) Install backend dependencies

```bash
npm install
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the App

### Start backend

From the project root:

```bash
npm run dev
```

This runs the Express server using `tsx watch`.

### Start frontend

From the frontend folder:

```bash
cd frontend
npm start
```

The frontend runs with Create React App and usually starts on:

```text
http://localhost:3000
```

The backend listens on:

```text
http://localhost:5000
```

## Available Scripts

### Root package scripts

```bash
npm run dev
npm run build
npm run start
npm run test
```

### Frontend package scripts

```bash
cd frontend
npm start
npm run build
npm test
npm run eject
```

## API Overview

The backend is mounted under `/api` and includes routes such as:

- `POST /api/register`
- `POST /api/verifyotp`
- `POST /api/login`
- `POST /api/forgot-password`
- `POST /api/reset-password/:token`
- `POST /api/links`
- `GET /api/links`
- `GET /api/links/stats`
- `PUT /api/links/:id`
- `DELETE /api/links/:id`
- `GET /api/braintree/plans`
- `GET /api/braintree/clienttoken`
- `POST /api/braintree/checkout`
- `POST /api/braintree/myplan/cancel`

Shortened links redirect through:

- `GET /r/:code`

## Notes

- The app uses Bootstrap styling and custom dashboard components.
- Email sending is configured through Nodemailer and is currently likely disabled in parts of the code if those sections are commented out.
- Braintree is used for paid plan management and subscription checkout.
- The repo is configured as a monorepo-style full-stack app with separate frontend and backend package management.

## Production Build

For backend compilation:

```bash
npm run build
```

For frontend production build:

```bash
cd frontend
npm run build
```

## License

This project is licensed under the ISC License.

## Contributing

Pull requests and improvements are welcome. For local development, keep the backend `.env` file private and do not commit secrets.
