# 🌍 CasaViva — Travel Stay Booking Platform

> A full-stack web application inspired by Airbnb. CasaViva allows users to explore, book, and host vacation stays with a user-friendly interface and robust backend logic.

## 🚀 Live Site

🔗 [Visit Wanderlust on Render] (https://casaviva-trye.onrender.com)

---

## 🧰 Tech Stack

- **Frontend:** HTML, EJS, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js
- **File Upload:** Cloudinary + Multer
- **Deployment:** Render
- **Other Tools:** Method-Override, Dotenv, Moment.js

---

## ✨ Features

### 🧳 For Guests
- Browse listings by categories (Mountains, Castles, Camping, etc.)
- View property details with image gallery, amenities, pricing, and map
- Book stays with date selection and real-time price calculation
- View and cancel upcoming bookings (at least 1 day prior)
- Leave and manage reviews on listings

### 🏠 For Hosts
- Create, edit, and delete listings
- Manage all received booking requests
- Confirm or reject bookings
- View booking status and sync changes with guest dashboards

### 🧠 Smart Logic
- Prevent overlapping bookings using date-range checks
- Block past dates and previously booked ranges in the reservation calendar
- Display a dynamic reservation summary with tax, fee, and total breakdown

---

## 🛠️ Getting Started

### ⚙️ Installation

```bash
git clone https://github.com/aman-2904/CasaViva.git
npm install
```

---

## 📦 Environment Variables

Create a .env file in the root directory with the following:

```bash
env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAP_TOKEN=your_mapbox_token
```

---

## ▶️ Run the App
```bash
npm start
```
Visit http://localhost:3000 to explore.

---

## 📁 Project Structure
```bash
wanderlust_website/
│
├── controllers/        # Route logic (bookings, listings, user, etc.)
├── models/             # Mongoose schemas
├── views/              # EJS templates (layouts, partials, pages)
├── routes/             # Express routes
├── public/             # Static files (CSS, JS)
├── utils/              # Helper functions
├── cloudConfig.js      # Cloudinary setup
├── middleware.js       # Custom middleware
└── app.js              # Main Express app
```
---

## 🧠 Learnings & Highlights

Implemented real-time date blocking for bookings using backend logic

Built reusable middleware for user and host auth flows

Designed modular MVC structure for scalability

Deployed a production-grade app on Render with persistent cloud storage

---

## 💬 Feedback & Contributions

I'm open to feedback and ideas! If you'd like to contribute or suggest an improvement, feel free to open an issue or pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

🙋‍♂️ About Me

Aman Jha

🌐 Website: 

---

Made by Aman Jha
