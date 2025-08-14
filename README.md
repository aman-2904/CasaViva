# 🌍 CasaViva

WanderLust is a full-stack travel listing application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to browse, create, and manage travel destination listings.

## 🚀 Features

- 🧳 Create, edit, and delete travel listings
- 📷 Upload images for each destination
- 🔒 User authentication & authorization
- 🗺️ Location & price support
- 💬 Flash messages for user feedback   > ⚙️ Currently working on adding **user reviews and ratings** for each travel listing. Stay tuned for updates!
- 🧼 Form validation and error handling

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, Bootstrap, EJS
- **Authentication:** Passport.js
- **Other:** Cloudinary (for image uploads), Mapbox , Express-session, Connect-flash

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aman-2904/WanderLust.git
   cd WanderLust
2. **Install dependencies**
   ```bash
   npm install

3. **Start the Server**
   ```bash
   npm start

4. **Visit the app**
   ```bash
   Open your browser at http://localhost:8080/listings

5. 📁 **Project Structure**
```bash
WanderLust/
├── .gitignore
├── README.md
├── app.js                  # Main Express server
├── package.json
├── package-lock.json
│
├── models/                # Mongoose models
│   └── schema.js
│
├── routes/                
│   └── listings.js      
│
├── utils/                 # Utility files
│   └── wrapAsync.js       # Async error wrapper
│
├── public/                # Static assets
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/            # (Optional for storing static images)
│
├── views/                 # EJS template files
│   ├── includes/          # Common partials
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │
│   ├── layouts/           # Layout wrapper
│   │   └── boilerplate.ejs
│   │
│   ├── listings/          # Views for listings
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   │
│   └── error.ejs          # Error page

🧪 Upcoming Features

1.User reviews & ratings

2.Map integration with Mapbox

3.Responsive UI improvements

🙋‍♂️ Author
Developed by Aman Jha

