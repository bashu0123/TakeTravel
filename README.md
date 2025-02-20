# TakeTravel

TakeTravel is a travel booking application that allows users to explore travel packages, book guided trips, and view nearby attractions such as hotels, bus stations, heritage sites, and restaurants. The platform includes an admin dashboard for managing bookings and packages and a guide dashboard for managing assigned trips.

## Project Structure

```
TakeTravel/
├── backend/      # Backend server (Node.js, Express, MongoDB)
│   ├── models/   # Database models
│   ├── routes/   # API routes
│   ├── controllers/ # Business logic
│   ├── config/   # Configuration files
│   ├── index.js  # Main server file
│   └── package.json
├── frontend/     # Frontend (React, Tailwind CSS, Lucide Icons)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── public/     # Static files (images, icons, etc.)
│   │   ├── context/    # Context providers (e.g., auth, theme)
│   │   ├── App.js      # Main application file
│   │   └── index.js    # Entry point
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md  # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (LTS version recommended)
- MongoDB (Atlas or Local)
- npm or yarn

### Backend Setup
```sh
cd backend
npm install
npm start
```
The backend server will start on `http://localhost:port`

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:port`

## Features
- **User Dashboard:** Users can browse travel packages, make bookings, and view their reservations.
- **Guide Dashboard:** Guides can view assigned trips and customer details.
- **Admin Dashboard:** Admins can manage bookings, users, and travel packages.
- **Explore Section:** Displays nearby hotels, bus stations, heritage sites, and restaurants using an interactive map.
- **Contact Us Page:** Allows users to send inquiries.
- **Secure Authentication:** Role-based access for users, guides, and admins.

## Login Credentials
- **User:**
  - Email: `user@gmail.com`
  - Password: `password`
- **Guide:**
  - Email: `guide@gmail.com`
  - Password: `password`
- **Admin:**
  - Email: `admin@gmail.com`
  - Password: `password`

## Contributing
If you’d like to contribute, feel free to fork the repo and submit a pull request!

## License
MIT License

 